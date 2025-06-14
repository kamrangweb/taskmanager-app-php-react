<?php
require_once '../config/conn.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Read SQL file
    $sql = file_get_contents('create_likes_table.sql');

    // Execute SQL
    $conn->exec($sql);
    echo "Likes table created successfully";
} catch(PDOException $e) {
    echo "Error creating likes table: " . $e->getMessage();
}
?> 