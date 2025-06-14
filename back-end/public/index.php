<?php
// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// --- CORS Ayarları ---
$allowed_origin = 'http://localhost:5173';  // React app URL

if ($_SERVER['HTTP_ORIGIN'] === $allowed_origin) {
    header("Access-Control-Allow-Origin: $allowed_origin");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Content-Type: application/json");
}

// OPTIONS (preflight) isteği geldiyse sadece 204 dön
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Giriş için route işlemleri
require_once __DIR__ . '/../services/AuthService.php';
require_once __DIR__ . '/../domain/AuthRepository.php';
require_once __DIR__ . '/../config/conn.php';

$database = new Database();
$conn = $database->getConnection();
$authRepository = new AuthRepository($conn);
$auth = new AuthService($authRepository);

// Route işlemleri
$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];
$base_path = '/php-projects/php-todo-react/back-end/public';
$endpoint = trim(str_replace($base_path, '', $uri), '/');

switch ($endpoint) {
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = json_decode(file_get_contents("php://input"), true);

            $username = $data['username'] ?? '';
            $password = $data['password'] ?? '';

            // dummy kontrol
            if ($username === 'admin' && $password === '1234') {
                echo json_encode([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'token' => 'fake-jwt-token',
                    'username' => $username
                ]);
            } else {
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Invalid credentials'
                ]);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
        }
        break;

    default:
        http_response_code(404);
        echo "Not Found";
        break;
    // case 'login':
    //     if ($method === 'POST') {
    //         $data = json_decode(file_get_contents("php://input"), true);
    //         if (!isset($data['username']) || !isset($data['password'])) {
    //             http_response_code(400);
    //             echo json_encode(['status' => 'error', 'message' => 'Username and password required']);
    //             exit;
    //         }

    //         try {
    //             $result = $auth->login($data['username'], $data['password']);
    //             if ($result) {
    //                 echo json_encode([
    //                     'status' => 'success',
    //                     'message' => 'Login successful',
    //                     'token' => $result['token'],
    //                     'username' => $data['username']
    //                 ]);
    //             } else {
    //                 http_response_code(401);
    //                 echo json_encode(['status' => 'error', 'message' => 'Invalid credentials']);
    //             }
    //         } catch (Exception $e) {
    //             http_response_code(500);
    //             echo json_encode(['status' => 'error', 'message' => 'Login error']);
    //         }
    //     } else {
    //         http_response_code(405);
    //         echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    //     }
    //     break;

    // case '':
    //     echo json_encode([
    //         "message" => "Welcome to the Todo API",
    //         "endpoints" => ["POST /login", "POST /register", "GET /todos"]
    //     ]);
    //     break;

    // // Diğer endpoint'ler burada devam edebilir...

    // default:
    //     http_response_code(404);
    //     echo json_encode([
    //         "status" => "error",
    //         "message" => "Invalid endpoint",
    //         "endpoint" => $endpoint
    //     ]);
    //     break;
}
