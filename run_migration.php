<?php
require_once 'db_connect.php';

try {
    $sql = file_get_contents('create_routed_logs.sql');
    $pdo->exec($sql);
    echo "Table 'routed_logs' created successfully.";
} catch (PDOException $e) {
    echo "Error creating table: " . $e->getMessage();
}
?>