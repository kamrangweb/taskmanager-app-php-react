<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');


// echo 'salam';

class Database {
    private $host = "localhost";
    private $db_name = "todo-app";
    private $username = "root";
    private $password = "root";
    public $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // echo 'Connected';
        } catch (PDOException $exception) {
            echo json_encode(["error" => "Database connection error: " . $exception->getMessage()]);
        }
        return $this->conn;
    }
}
?>
