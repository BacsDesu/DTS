<?php
/**
 * API Endpoint Handler
 * Handles AJAX requests for Document Tracking System
 */

header('Content-Type: application/json');

require_once 'db_connect.php';

$action = $_GET['action'] ?? $_POST['action'] ?? null;

// Allow login action without session
if ($action === 'login') {
    handleLogin();
    exit;
}

// Check authentication for all other actions
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    switch ($action) {
        case 'logout':
            handleLogout();
            break;

        case 'fetch_all':
            handleFetchAll();
            break;
        
        case 'fetch_stats':
            handleFetchStats();
            break;
        
        case 'insert':
            handleInsert();
            break;
        
        case 'update':
            handleUpdate();
            break;

        case 'fetch_routed':
            handleFetchRouted();
            break;
            
        case 'insert_routed':
            handleInsertRouted();
            break;
            
        case 'update_routed':
            handleUpdateRouted();
            break;
        
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

/**
 * Handle Login
 */
function handleLogin() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['username']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password required']);
        return;
    }
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$data['username']]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($data['password'], $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = 'admin'; // For now, all users are admins
        
        echo json_encode(['success' => true, 'user' => [
            'id' => $user['id'],
            'username' => $user['username']
        ]]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
}

/**
 * Handle Logout
 */
function handleLogout() {
    session_destroy();
    header("Location: login.php");
    exit;
}

/**
 * Fetch all documents with optional filters
 */
function handleFetchAll() {
    global $pdo;
    
    $search = $_GET['search'] ?? '';
    $doc_type = $_GET['doc_type'] ?? '';
    $status = $_GET['status'] ?? '';
    $date_from = $_GET['date_from'] ?? '';
    $date_to = $_GET['date_to'] ?? '';
    $office = $_GET['office'] ?? '';
    
    // Pagination parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;

    // Sorting parameters
    $sort_field = $_GET['sort_field'] ?? 'id';
    $sort_dir = $_GET['sort_dir'] ?? 'DESC';
    
    // Whitelist sort fields to prevent SQL injection
    $allowed_sort_fields = ['id', 'date_created', 'office_campus', 'forwarded_by', 'doc_type', 'title', 'amount', 'received_by', 'forwarded_to', 'date_received', 'status'];
    if (!in_array($sort_field, $allowed_sort_fields)) {
        $sort_field = 'id';
    }
    $sort_dir = strtoupper($sort_dir) === 'ASC' ? 'ASC' : 'DESC';
    
    $where_clauses = ["1=1"];
    $params = [];
    
    // Search by title, forwarded_by, received_by
    if (!empty($search)) {
        $search_term = "%{$search}%";
        $where_clauses[] = "(title LIKE ? OR forwarded_by LIKE ? OR received_by LIKE ?)";
        $params = array_merge($params, [$search_term, $search_term, $search_term]);
    }
    
    // Filter by document type
    if (!empty($doc_type)) {
        $where_clauses[] = "doc_type = ?";
        $params[] = $doc_type;
    }
    
    // Filter by status
    if (!empty($status)) {
        if ($status === '!Pending') {
            $where_clauses[] = "status != ?";
            $params[] = 'Pending';
        } else {
            $where_clauses[] = "status = ?";
            $params[] = $status;
        }
    }
    
    // Filter by date range
    if (!empty($date_from)) {
        $where_clauses[] = "date_received >= ?";
        $params[] = $date_from;
    }
    
    if (!empty($date_to)) {
        $where_clauses[] = "date_received <= ?";
        $params[] = $date_to;
    }
    
    // Filter by office/campus
    if (!empty($office)) {
        $where_clauses[] = "office_campus = ?";
        $params[] = $office;
    }
    
    $where_sql = implode(' AND ', $where_clauses);
    
    // Get total count for pagination
    $count_query = "SELECT COUNT(*) FROM logs WHERE $where_sql";
    $count_stmt = $pdo->prepare($count_query);
    $count_stmt->execute($params);
    $total_records = $count_stmt->fetchColumn();
    $total_pages = ceil($total_records / $limit);
    
    // Get data
    $query = "SELECT * FROM logs WHERE $where_sql ORDER BY $sort_field $sort_dir LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $logs = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true, 
        'data' => $logs,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $total_pages,
            'total_records' => $total_records,
            'limit' => $limit
        ]
    ]);
}

/**
 * Fetch dashboard statistics
 */
function handleFetchStats() {
    global $pdo;
    
    // Get total count
    $stmt = $pdo->query("SELECT COUNT(*) FROM logs");
    $total = $stmt->fetchColumn();
    
    // Get count by status
    $stmt = $pdo->query("SELECT status, COUNT(*) as count FROM logs GROUP BY status");
    $rows = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);
    
    echo json_encode([
        'success' => true, 
        'data' => [
            'total' => $total,
            'counts' => $rows
        ]
    ]);
}

/**
 * Insert a new document
 */
function handleInsert() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($data['date_created']) || empty($data['office_campus']) || 
        empty($data['forwarded_by']) || empty($data['doc_type']) || empty($data['title'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    $query = "INSERT INTO logs (date_created, office_campus, forwarded_by, doc_type, title, amount, received_by, forwarded_to, date_received, status) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([
        $data['date_created'],
        $data['office_campus'],
        $data['forwarded_by'],
        $data['doc_type'],
        $data['title'],
        !empty($data['amount']) ? $data['amount'] : 0.00,
        $data['received_by'] ?? '',
        $data['forwarded_to'] ?? '',
        $data['date_received'] ?? null,
        $data['status'] ?? 'Pending'
    ]);
    
    if ($result) {
        $newId = $pdo->lastInsertId();
        
        // Fetch the inserted record
        $query = "SELECT * FROM logs WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$newId]);
        $newRecord = $stmt->fetch();
        
        echo json_encode(['success' => true, 'data' => $newRecord]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to insert record']);
    }
}

/**
 * Update a document field
 */
function handleUpdate() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id']) || empty($data['field'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing id or field']);
        return;
    }
    
    $id = $data['id'];
    $field = $data['field'];
    $value = $data['value'];
    
    // Whitelist allowed fields
    $allowedFields = ['date_created', 'office_campus', 'forwarded_by', 'doc_type', 'title', 'amount', 'received_by', 'forwarded_to', 'date_received', 'status'];
    
    if (!in_array($field, $allowedFields)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid field']);
        return;
    }
    
    $query = "UPDATE logs SET $field = ? WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([$value, $id]);
    
    if ($result) {
        // Fetch updated record
        $query = "SELECT * FROM logs WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$id]);
        $updatedRecord = $stmt->fetch();
        
        echo json_encode(['success' => true, 'data' => $updatedRecord]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update record']);
    }
}

/**
 * Fetch routed logs
 */
function handleFetchRouted() {
    global $pdo;
    
    $search = $_GET['search'] ?? '';
    $date_from = $_GET['date_from'] ?? '';
    $date_to = $_GET['date_to'] ?? '';
    
    // Pagination parameters
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    $offset = ($page - 1) * $limit;

    // Sorting parameters
    $sort_field = $_GET['sort_field'] ?? 'id';
    $sort_dir = $_GET['sort_dir'] ?? 'DESC';
    
    // Whitelist sort fields
    $allowed_sort_fields = ['id', 'doc_date', 'doc_no', 'sender', 'subject', 'recipient'];
    if (!in_array($sort_field, $allowed_sort_fields)) {
        $sort_field = 'id';
    }
    $sort_dir = strtoupper($sort_dir) === 'ASC' ? 'ASC' : 'DESC';
    
    $where_clauses = ["1=1"];
    $params = [];
    
    // Search
    if (!empty($search)) {
        $search_term = "%{$search}%";
        $where_clauses[] = "(subject LIKE ? OR sender LIKE ? OR doc_no LIKE ?)";
        $params = array_merge($params, [$search_term, $search_term, $search_term]);
    }
    
    // Filter by date range
    if (!empty($date_from)) {
        $where_clauses[] = "doc_date >= ?";
        $params[] = $date_from;
    }

    if (!empty($date_to)) {
        $where_clauses[] = "doc_date <= ?";
        $params[] = $date_to;
    }
    
    $where_sql = implode(' AND ', $where_clauses);
    
    // Get total count
    $count_query = "SELECT COUNT(*) FROM routed_logs WHERE $where_sql";
    $count_stmt = $pdo->prepare($count_query);
    $count_stmt->execute($params);
    $total_records = $count_stmt->fetchColumn();
    $total_pages = ceil($total_records / $limit);
    
    // Get data
    $query = "SELECT * FROM routed_logs WHERE $where_sql ORDER BY $sort_field $sort_dir LIMIT $limit OFFSET $offset";
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $logs = $stmt->fetchAll();
    
    echo json_encode([
        'success' => true, 
        'data' => $logs,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => $total_pages,
            'total_records' => $total_records,
            'limit' => $limit
        ]
    ]);
}

/**
 * Insert a new routed log
 */
function handleInsertRouted() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    if (empty($data['doc_date']) || empty($data['doc_no']) || 
        empty($data['sender']) || empty($data['subject']) || empty($data['recipient'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        return;
    }
    
    $query = "INSERT INTO routed_logs (doc_date, doc_no, sender, subject, recipient, status) 
              VALUES (?, ?, ?, ?, ?, ?)";
    
    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([
        $data['doc_date'],
        $data['doc_no'],
        $data['sender'],
        $data['subject'],
        $data['recipient'],
        $data['status'] ?? 'Pending'
    ]);
    
    if ($result) {
        $newId = $pdo->lastInsertId();
        
        // Fetch the inserted record
        $query = "SELECT * FROM routed_logs WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$newId]);
        $newRecord = $stmt->fetch();
        
        echo json_encode(['success' => true, 'data' => $newRecord]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to insert record']);
    }
}

/**
 * Update a routed log field
 */
function handleUpdateRouted() {
    global $pdo;
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id']) || empty($data['field'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing id or field']);
        return;
    }
    
    $id = $data['id'];
    $field = $data['field'];
    $value = $data['value'];
    
    // Whitelist allowed fields
    $allowedFields = ['doc_date', 'doc_no', 'sender', 'subject', 'recipient', 'status'];
    
    if (!in_array($field, $allowedFields)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid field']);
        return;
    }
    
    $query = "UPDATE routed_logs SET $field = ? WHERE id = ?";
    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([$value, $id]);
    
    if ($result) {
        // Fetch updated record
        $query = "SELECT * FROM routed_logs WHERE id = ?";
        $stmt = $pdo->prepare($query);
        $stmt->execute([$id]);
        $updatedRecord = $stmt->fetch();
        
        echo json_encode(['success' => true, 'data' => $updatedRecord]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update record']);
    }
}
?>
