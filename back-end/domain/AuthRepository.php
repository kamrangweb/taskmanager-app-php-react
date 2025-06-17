<?php
    class AuthRepository {
        private $conn;

        public function __construct($db) {
            $this->conn = $db;
        }

        // Get Todos by User ID
        public function createUser($username, $password) {
            try {
                $query = "INSERT INTO users (username, password) VALUES (:username, :password)";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":username", $username);
                $stmt->bindParam(":password", $password);

                if ($stmt->execute()) {
                    return ["message" => "User registered successfully!"];
                } else {
                    return ["error" => "User registration failed!"];
                }
            } catch (PDOException $e) {
                throw new Exception("Registration failed: " . $e->getMessage());
            }
        }
        
        // Get Users by User ID
        public function getUser($username) {
            try {
                $query = "SELECT id, username, password FROM users WHERE username = :username";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(":username", $username);
                $stmt->execute();

                $user = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($user) {
                    // Add user_id field for JWT
                    $user['user_id'] = $user['id'];
                }
                
                return $user;
            } catch (PDOException $e) {
                throw new Exception("Login failed: " . $e->getMessage());
            }
        }    
    }
?>
