<?php
// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Import JWT library
require_once __DIR__ . '/../vendor/autoload.php';
use \Firebase\JWT\JWT;
use \Firebase\JWT\Key;

// Giriş için route işlemleri
require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../domain/AuthRepository.php';
require_once __DIR__ . '/../services/TodoService.php';
require_once __DIR__ . '/../domain/TodoRepository.php';
require_once __DIR__ . '/../config/conn.php';

$database = new Database();
$conn = $database->getConnection();
$authRepository = new AuthRepository($conn);
$auth = new AuthService($authRepository);
$todoRepository = new TodoRepository($conn);
$todoService = new TodoService($todoRepository);

// Route işlemleri
$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];
$base_path = '/php-projects/php-todo-react/back-end/public';
$endpoint = trim(str_replace($base_path, '', $uri), '/');

// Get user ID from token
function getUserIdFromToken() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) {
        return null;
    }

    $token = str_replace('Bearer ', '', $headers['Authorization']);
    try {
        $decoded = JWT::decode($token, new Key("your_secret_key", 'HS256'));
        return $decoded->user_id;
    } catch (Exception $e) {
        return null;
    }
}

// Handle registration endpoint
if ($endpoint === 'register') {
    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['username']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Username and password required']);
            exit;
        }

        try {
            $result = $auth->register($data['username'], $data['password']);
            if ($result) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Registration successful'
                ]);
            } else {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Registration failed']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Registration error: ' . $e->getMessage()]);
        }
        exit;
    } else {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        exit;
    }
}

// Handle login endpoint
if ($endpoint === 'login') {
    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['username']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Username and password required']);
            exit;
        }

        try {
            $result = $auth->login($data['username'], $data['password']);
            if (isset($result['token'])) {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'token' => $result['token'],
                    'username' => $data['username']
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Login error: ' . $e->getMessage()]);
        }
        exit;
    } else {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
        exit;
    }
}

// Check if endpoint is todos
if (strpos($endpoint, 'todos') === 0) {
    $userId = getUserIdFromToken();
    if (!$userId) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }

    // Handle todos endpoints
    if ($endpoint === 'todos') {
        switch ($method) {
            case 'GET':
                try {
                    $todos = $todoService->getTodos($userId);
                    echo json_encode(['status' => 'success', 'data' => $todos]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
                }
                break;

            case 'POST':
                $data = json_decode(file_get_contents("php://input"), true);
                if (!isset($data['task'])) {
                    http_response_code(400);
                    echo json_encode(['status' => 'error', 'message' => 'Task is required']);
                    exit;
                }

                try {
                    $todo = $todoService->createTodo($userId, $data['task']);
                    echo json_encode(['status' => 'success', 'data' => $todo]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                break;
        }
    } else {
        // Handle specific todo endpoints (e.g., /todos/1)
        $parts = explode('/', $endpoint);
        if (count($parts) === 2 && is_numeric($parts[1])) {
            $todoId = (int)$parts[1];
            
            switch ($method) {
                case 'PUT':
                    $data = json_decode(file_get_contents("php://input"), true);
                    try {
                        $success = $todoService->updateTodo($todoId, $userId, $data);
                        if ($success) {
                            echo json_encode(['status' => 'success', 'message' => 'Todo updated successfully']);
                        } else {
                            http_response_code(404);
                            echo json_encode(['status' => 'error', 'message' => 'Todo not found']);
                        }
                    } catch (Exception $e) {
                        http_response_code(500);
                        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
                    }
                    break;

                case 'DELETE':
                    try {
                        $success = $todoService->deleteTodo($todoId, $userId);
                        if ($success) {
                            echo json_encode(['status' => 'success', 'message' => 'Todo deleted successfully']);
                        } else {
                            http_response_code(404);
                            echo json_encode(['status' => 'error', 'message' => 'Todo not found']);
                        }
                    } catch (Exception $e) {
                        http_response_code(500);
                        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
                    }
                    break;

                default:
                    http_response_code(405);
                    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
                    break;
            }
        } elseif (count($parts) === 3 && $parts[2] === 'like') {
            // Handle like endpoint (e.g., /todos/1/like)
            if ($method === 'POST') {
                try {
                    $result = $todoService->toggleLike($todoId, $userId);
                    echo json_encode(['status' => 'success', 'data' => $result]);
                } catch (Exception $e) {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
                }
            } else {
                http_response_code(405);
                echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
            }
        } else {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'Invalid endpoint']);
        }
    }
    exit;
}

// If no endpoint matches
http_response_code(404);
echo json_encode([
    "status" => "error",
    "message" => "Invalid endpoint",
    "endpoint" => $endpoint
]);
