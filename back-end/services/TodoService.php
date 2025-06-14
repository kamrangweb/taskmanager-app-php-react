<?php
class TodoService {
    private $TodoRepository;

    public function __construct($todoRepository) {
        $this->TodoRepository = $todoRepository;
    }

    // Get Todos by User ID
    public function getTodos($user_id) {
        if ($user_id) {
            // return ["message" => "Task added successfully!"];
            return $this -> TodoRepository -> getTodos($user_id);

        }
        return ["error" => "Task creation failed!"];    
    }

    // Create a New Todo
    public function createTodo($user_id, $task) {
        $result = $this -> TodoRepository -> createTodo($user_id, $task);

        if ($result) {
            return ["message" => "Task added successfully!"];
        }
        return ["error" => "Task creation failed!"];        
    }

    // Update Todo
    public function updateTodo($id, $task, $completed) {
       return $this -> TodoRepository -> updateTodo($id, $task, $completed);
    }

    // Delete Todo
    public function deleteTodo($id) {
       return $this -> TodoRepository -> deleteTodo($id);
    }

    // Toggle Like
    public function toggleLike($todo_id, $user_id) {
        return $this->TodoRepository->toggleLike($todo_id, $user_id);
    }

    // Check if user has liked a todo
    public function hasLiked($todo_id, $user_id) {
        return $this->TodoRepository->hasLiked($todo_id, $user_id);
    }
}
?>
