<?php
/**
 * index.php - Simple redirect file
 */

// Start session if not started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
if (isset($_SESSION['user_id']) && !empty($_SESSION['user_id'])) {
    // User is logged in, go to dashboard
    header("Location: dashboard.php");
    exit();
} else {
    // User is not logged in, show login page
    require_once 'login.php'; // Your renamed login file
}
?>