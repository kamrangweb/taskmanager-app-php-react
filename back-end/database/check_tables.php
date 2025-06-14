<?php
require_once '../config/conn.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Check users table
    $stmt = $conn->query("SHOW TABLES LIKE 'users'");
    echo "Users table exists: " . ($stmt->rowCount() > 0 ? "Yes" : "No") . "\n";
    if ($stmt->rowCount() > 0) {
        $stmt = $conn->query("DESCRIBE users");
        echo "Users table structure:\n";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            print_r($row);
        }
    }

    // Check todos table
    $stmt = $conn->query("SHOW TABLES LIKE 'todos'");
    echo "\nTodos table exists: " . ($stmt->rowCount() > 0 ? "Yes" : "No") . "\n";
    if ($stmt->rowCount() > 0) {
        $stmt = $conn->query("DESCRIBE todos");
        echo "Todos table structure:\n";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            print_r($row);
        }
    }

    // Check likes table
    $stmt = $conn->query("SHOW TABLES LIKE 'likes'");
    echo "\nLikes table exists: " . ($stmt->rowCount() > 0 ? "Yes" : "No") . "\n";
    if ($stmt->rowCount() > 0) {
        $stmt = $conn->query("DESCRIBE likes");
        echo "Likes table structure:\n";
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            print_r($row);
        }
    }

} catch(PDOException $e) {
    echo "Error checking tables: " . $e->getMessage();
}
?> 