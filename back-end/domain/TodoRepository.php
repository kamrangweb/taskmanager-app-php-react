<?php
class TodoRepository {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get Todos by User ID
    public function getTodos($user_id) {
        $query = "SELECT t.*, COUNT(l.id) as likes FROM todos t 
                 LEFT JOIN likes l ON t.id = l.todo_id 
                 WHERE t.user_id = :user_id 
                 GROUP BY t.id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Create a New Todo
    public function createTodo($user_id, $task) {
        $query = "INSERT INTO todos (user_id, task) VALUES (:user_id, :task)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":task", $task);

        return $stmt -> execute();
    }

    // Update Todo
    public function updateTodo($id, $task, $completed) {
        $query = "UPDATE todos SET task = :task, completed = :completed WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":task", $task);
        $stmt->bindParam(":completed", $completed);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            return ["message" => "Task updated successfully!"];
        }
        return ["error" => "Task update failed!"];
    }

    // Delete Todo
    public function deleteTodo($id) {
        $query = "DELETE FROM todos WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);

        if ($stmt->execute()) {
            return ["message" => "Task deleted successfully!"];
        }
        return ["error" => "Task deletion failed!"];
    }

    // Toggle Like
    public function toggleLike($todo_id, $user_id) {
        try {
            // Check if like exists
            $checkQuery = "SELECT id FROM likes WHERE todo_id = :todo_id AND user_id = :user_id";
            $checkStmt = $this->conn->prepare($checkQuery);
            $checkStmt->bindParam(":todo_id", $todo_id);
            $checkStmt->bindParam(":user_id", $user_id);
            $checkStmt->execute();
            
            if ($checkStmt->rowCount() > 0) {
                // Unlike
                $query = "DELETE FROM likes WHERE todo_id = :todo_id AND user_id = :user_id";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":todo_id", $todo_id);
                $stmt->bindParam(":user_id", $user_id);
                $stmt->execute();
                return ["message" => "Unliked successfully!", "action" => "unlike"];
            } else {
                // Like
                $query = "INSERT INTO likes (todo_id, user_id) VALUES (:todo_id, :user_id)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":todo_id", $todo_id);
                $stmt->bindParam(":user_id", $user_id);
                $stmt->execute();
                return ["message" => "Liked successfully!", "action" => "like"];
            }
        } catch (PDOException $e) {
            error_log("Like error: " . $e->getMessage());
            return ["error" => "Like operation failed: " . $e->getMessage()];
        }
    }

    // Check if user has liked a todo
    public function hasLiked($todo_id, $user_id) {
        $query = "SELECT id FROM likes WHERE todo_id = :todo_id AND user_id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":todo_id", $todo_id);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
?>
