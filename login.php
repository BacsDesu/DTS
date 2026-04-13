<?php
require_once 'db_connect.php';

// Redirect if already logged in
if (isset($_SESSION['user_id'])) {
    header("Location: dashboard.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Document Tracking System</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        body {
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .login-card {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            width: 100%;
            max-width: 400px;
        }
        .login-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .login-logo {
            height: 80px;
            margin-bottom: 1rem;
        }
        .login-title {
            font-size: 1.5rem;
            font-weight: bold;
            color: #111827;
            margin: 0;
        }
        .login-subtitle {
            color: #6b7280;
            margin-top: 0.5rem;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #374151;
            font-weight: 500;
        }
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 1rem;
            box-sizing: border-box; /* Important for padding */
        }
        .btn-full {
            width: 100%;
            justify-content: center;
            margin-top: 1rem;
        }
        .alert {
            padding: 0.75rem;
            border-radius: 0.375rem;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            display: none;
        }
        .alert-error {
            background-color: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }
    </style>
</head>
<body>
    <div class="login-card">
        <div class="login-header">
            <img src="nisu-logo.png" alt="NISU Logo" class="login-logo">
            <h1 class="login-title">NISU DTS</h1>
            <p class="login-subtitle">Sign in to your account</p>
        </div>

        <div id="loginAlert" class="alert alert-error"></div>

        <form id="loginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required autofocus>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="btn btn-primary btn-full">
                Sign In
            </button>
        </form>
    </div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const alertBox = document.getElementById('loginAlert');
            const submitBtn = this.querySelector('button[type="submit"]');
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
            alertBox.style.display = 'none';

            try {
                const response = await fetch('api.php?action=login', {
                    method: 'POST',
                    body: JSON.stringify(Object.fromEntries(formData)),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    window.location.href = 'dashboard.php';
                } else {
                    alertBox.textContent = data.error || 'Login failed';
                    alertBox.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Sign In';
                }
            } catch (error) {
                alertBox.textContent = 'An error occurred. Please try again.';
                alertBox.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Sign In';
            }
        });
    </script>
</body>
</html>
