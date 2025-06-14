<?php
    class AuthRepository {
        private $conn;

        public function __construct($db) {
            $this->conn = $db;
        }

        // Get Todos by User ID
        public function createUser($username, $password) {
            $query = "INSERT INTO users (username, password) VALUES (:username, :password)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":username", $username);
            $stmt->bindParam(":password", $password);

            //bura atilacaq service
            if ($stmt->execute()) {
                return ["message" => "User registered successfully!"];
            } else {
                return ["error" => "User registration failed!"];
            }
        }
        
        // Get Users by User ID
        public function getUser($username) {
            $query = "SELECT * FROM users WHERE username = :username";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(":username", $username);
            $stmt->execute();

            return  $user = $stmt->fetch(PDO::FETCH_ASSOC);       
        }    
    }
?>
