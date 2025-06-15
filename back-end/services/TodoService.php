<?php
require_once __DIR__ . '/../domain/TodoRepository.php';

class TodoService {
    private $todoRepository;

    public function __construct($todoRepository) {
        $this->todoRepository = $todoRepository;
    }

    // Get Todos by User ID
    public function getTodos($userId) {
        return $this->todoRepository->getTodos($userId);
    }

    // Create a New Todo
    public function createTodo($userId, $task) {
        return $this->todoRepository->createTodo($userId, $task);
    }

    // Update Todo
    public function updateTodo($todoId, $userId, $data) {
        return $this->todoRepository->updateTodo($todoId, $userId, $data);
    }

    // Delete Todo
    public function deleteTodo($todoId, $userId) {
        return $this->todoRepository->deleteTodo($todoId, $userId);
    }

    // Toggle Like
    public function toggleLike($todoId, $userId) {
        return $this->todoRepository->toggleLike($todoId, $userId);
    }

    // Check if user has liked a todo
    public function hasLiked($todo_id, $user_id) {
        return $this->todoRepository->hasLiked($todo_id, $user_id);
    }
}
?>
