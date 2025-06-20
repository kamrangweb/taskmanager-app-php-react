<?php
class TodoRepository {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function getTodos($userId) {
        try {
            // Get todos for specific user
            $query = "SELECT t.*, 
                     (SELECT COUNT(*) FROM likes WHERE todo_id = t.id) as likes,
                     (SELECT COUNT(*) FROM likes WHERE todo_id = t.id AND user_id = ?) as has_liked
                     FROM todos t 
                     WHERE t.user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$userId, $userId]);
            
            $todos = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $row['hasLiked'] = (bool)$row['has_liked'];
                unset($row['has_liked']);
                $todos[] = $row;
            }
            
            return $todos;
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            throw new Exception("Error fetching todos: " . $e->getMessage());
        }
    }

    public function createTodo($userId, $task) {
        try {
            $query = "INSERT INTO todos (user_id, task, completed) VALUES (?, ?, 0)";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$userId, $task]);
            
            return [
                'id' => $this->conn->lastInsertId(),
                'task' => $task,
                'completed' => false,
                'likes' => 0,
                'hasLiked' => false
            ];
        } catch (PDOException $e) {
            throw new Exception("Error creating todo: " . $e->getMessage());
        }
    }

    public function updateTodo($todoId, $userId, $data) {
        try {
            $updates = [];
            $params = [];
            
            if (isset($data['task'])) {
                $updates[] = "task = ?";
                $params[] = $data['task'];
            }
            
            if (isset($data['completed'])) {
                $updates[] = "completed = ?";
                $params[] = $data['completed'] ? 1 : 0;
            }
            
            if (empty($updates)) {
                return false;
            }
            
            $params[] = $todoId;
            $params[] = $userId;
            
            $query = "UPDATE todos SET " . implode(", ", $updates) . " WHERE id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            throw new Exception("Error updating todo: " . $e->getMessage());
        }
    }

    public function deleteTodo($todoId, $userId) {
        try {
            $query = "DELETE FROM todos WHERE id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$todoId, $userId]);
            
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            throw new Exception("Error deleting todo: " . $e->getMessage());
        }
    }

    public function toggleLike($todoId, $userId) {
        try {
            $this->conn->beginTransaction();
            
            // Check if already liked
            $query = "SELECT COUNT(*) FROM likes WHERE todo_id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$todoId, $userId]);
            $hasLiked = $stmt->fetchColumn() > 0;
            
            if ($hasLiked) {
                // Unlike
                $query = "DELETE FROM likes WHERE todo_id = ? AND user_id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([$todoId, $userId]);
                $action = 'unlike';
            } else {
                // Like
                $query = "INSERT INTO likes (todo_id, user_id) VALUES (?, ?)";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([$todoId, $userId]);
                $action = 'like';
            }
            
            $this->conn->commit();
            return ['action' => $action];
        } catch (PDOException $e) {
            $this->conn->rollBack();
            throw new Exception("Error toggling like: " . $e->getMessage());
        }
    }

    public function hasLiked($todoId, $userId) {
        try {
            $query = "SELECT COUNT(*) FROM likes WHERE todo_id = ? AND user_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$todoId, $userId]);
            return $stmt->fetchColumn() > 0;
        } catch (PDOException $e) {
            throw new Exception("Error checking like status: " . $e->getMessage());
        }
    }
}
?>
