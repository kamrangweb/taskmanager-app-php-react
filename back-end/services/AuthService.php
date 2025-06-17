<?php
require '../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService {
    private $AuthRepository;
    private $secret_key = "your_secret_key"; // Use a strong key!

    public function __construct($authRepository) {
        $this->AuthRepository = $authRepository;
    }

    // User Registration
    public function register($username, $password) {
        try {
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            return $this->AuthRepository->createUser($username, $hashed_password);
        } catch (Exception $e) {
            throw new Exception("Registration failed: " . $e->getMessage());
        }
    }

    // User Login
    public function login($username, $password) {
        try {
            $user = $this->AuthRepository->getUser($username);
            
            if (!$user) {
                return ["error" => "Invalid username or password!"];
            }
            
            if (password_verify($password, $user['password'])) {
                $token = JWT::encode([
                    "user_id" => $user['user_id'],
                    "exp" => time() + 3600
                ], $this->secret_key, 'HS256');
                
                return [
                    "message" => "Login successful!",
                    "token" => $token,
                    "username" => $user['username']
                ];
            }
            
            return ["error" => "Invalid username or password!"];
        } catch (Exception $e) {
            throw new Exception("Login failed: " . $e->getMessage());
        }
    }

    // Validate Token
    public function validateToken($token) {
        try {
            return JWT::decode($token, new Key($this->secret_key, 'HS256'));
        } catch (Exception $e) {
            return ["error" => "Invalid token: " . $e->getMessage()];
        }
    }
}
?>
