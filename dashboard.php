<?php
require_once 'db_connect.php';

// Redirect to login if not authenticated
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Tracking System - NISU</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="fixed-top-section">
        <!-- Header -->
        <header class="app-header">
            <div class="header-content">
                <div class="logo-section">
                    <img src="nisu-logo.png" class="nisu-logo">
                </div>
                <div class="title-section">
                    <h1>Northern Iloilo State University</h1>
                    <p>Office of the University President</p>
                    <p class="subtitle">Document Tracking System</p>
                </div>
                <div class="user-section" style="margin-left: auto; display: flex; align-items: center; gap: 10px;">
                    <span style="color: white;">Welcome, <?php echo htmlspecialchars($_SESSION['username'] ?? 'User'); ?></span>
                    <button id="logoutBtn" class="btn btn-secondary" onclick="window.location.href='api.php?action=logout'">
                        Logout
                    </button>
                </div>
            </div>
        </header>

        <!-- Statistics Dashboard -->
        <div class="stats-dashboard">
            <div class="stat-item">
                <span class="stat-label">Total Documents</span>
                <span class="stat-value" id="statTotal">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Pending</span>
                <span class="stat-value" id="statPending" style="color: #f39c12;">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Released</span>
                <span class="stat-value" id="statReleased" style="color: #3498db;">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Delivered</span>
                <span class="stat-value" id="statDelivered" style="color: #27ae60;">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Disapproved</span>
                <span class="stat-value" id="statDisapproved" style="color: #e74c3c;">0</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Forwarded</span>
                <span class="stat-value" id="statForwarded" style="color: #9b59b6;">0</span>
            </div>
            
        </div>

        <!-- Tabs -->
        <div class="tabs-container">
            <button class="tab-btn active" onclick="switchTab('regular')">Regular Logs</button>
            <button class="tab-btn" onclick="switchTab('routed')">Routed Logs</button>
        </div>

        <!-- Regular Toolbar -->
        <div id="regularToolbar" class="toolbar-container">
            <!-- Action Bar -->
            <div class="action-bar">
                <button id="newEntryBtn" class="btn btn-primary">
                    <span class="icon">➕</span> New Entry
                </button>
                <button id="printBtn" class="btn btn-secondary">
                    <span class="icon">🖨️</span> Print
                </button>
                <button id="bulkStatusBtn" class="btn btn-secondary" style="display: none;">
                    <span class="icon">✏️</span> Update Selected
                </button>
                <div class="divider" style="width: 1px; height: 24px; background: #ddd; margin: 0 10px;"></div>
                <button id="undoBtn" class="btn btn-outline" disabled title="Undo (Ctrl+Z)">
                    <span class="icon">↩️</span> Undo
                </button>
                <button id="redoBtn" class="btn btn-outline" disabled title="Redo (Ctrl+Y)">
                    <span class="icon">↪️</span> Redo
                </button>
            </div>
    
            <!-- Filter Bar -->
            <div class="filter-bar">
                <div class="filter-group">
                    <label for="searchInput">Search:</label>
                    <input type="text" id="searchInput" class="filter-input" placeholder="Search by title, sender...">
                </div>
    
                <div class="filter-group">
                    <label for="docTypeFilter">Document Type:</label>
                    <select id="docTypeFilter" class="filter-select">
                        <option value="">All Types</option>
                        <option value="Proposal">Proposal</option>
                        <option value="Advisory">Advisory</option>
                        <option value="Application for Leave">Application for Leave</option>
                        <option value="Approved Budget of Contract">Approved Budget of Contract</option>
                        <option value="Authority to Travel">Authority to Travel</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Clearance">Clearance</option>
                        <option value="Contract">Contract</option>
                        <option value="Check">Check</option>
                        <option value="DTR">DTR</option>
                        <option value="Endorsement/Indorsement">Endorsement/Indorsement</option>
                        <option value="Itinerary">Itinerary</option>
                        <option value="Liquidation">Liquidation</option>
                        <option value="Memorandum">Memorandum</option>
                        <option value="Memorandum of Agreement">Memorandum of Agreement</option>
                        <option value="Monetization">Monetization</option>
                        <option value="Notice of Award">Notice of Award</option>
                        <option value="Notice to Proceed">Notice to Proceed</option>
                        <option value="Notice of Step Increment">Notice of Step Increment</option>
                        <option value="Payroll">Payroll</option>
                        <option value="PPMP">PPMP</option>
                        <option value="PRE">PRE</option>
                        <option value="Purchase Order">Purchase Order</option>
                        <option value="Purchase Request">Purchase Request</option>
                        <option value="Resolution">Resolution</option>
                        <option value="Requisition and Issue Slip">Requisition and Issue Slip</option>
                        <option value="Transmittal">Transmittal</option>
                        <option value="Travel Form">Travel Form</option>
                        <option value="Voucher">Voucher</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
    
                <div class="filter-group">
                    <label for="statusFilter">Status:</label>
                    <select id="statusFilter" class="filter-select">
                        <option value="">All Status</option>
                        <option value="!Pending">Outgoing</option>
                        <option value="Pending">Pending</option>
            
                        <option value="Released">Released</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Disapproved">Disapproved</option>
                        <option value="Forwarded">Forwarded</option>
                    </select>
                </div>
    
                <div class="filter-group">
                    <label for="officeFilter">Office/Campus:</label>
                    <select id="officeFilter" class="filter-select">
                        <option value="">All Offices</option>
                    </select>
                </div>
    
                <div class="filter-group">
                    <label for="dateFrom">Date From:</label>
                    <input type="date" id="dateFrom" class="filter-input">
                </div>
                
                <div class="filter-group">
                    <label for="dateTo">Date To:</label>
                    <input type="date" id="dateTo" class="filter-input">
                </div>
    
                <div class="filter-group">
                    <label style="visibility: hidden;">Action</label>
                    <button id="resetFiltersBtn" class="btn btn-outline">Reset Filters</button>
                </div>
            </div>
        </div>

        <!-- Routed Toolbar -->
        <div id="routedToolbar" class="toolbar-container" style="display: none;">
            <div class="action-bar">
                <button id="newRoutedEntryBtn" class="btn btn-primary">
                    <span class="icon">➕</span> New Entry
                </button>
                <button id="printRoutedBtn" class="btn btn-secondary">
                    <span class="icon">🖨️</span> Print
                </button>
                <div class="divider" style="width: 1px; height: 24px; background: #ddd; margin: 0 10px;"></div>
                <button id="routedUndoBtn" class="btn btn-outline" disabled title="Undo (Ctrl+Z)">
                    <span class="icon">↩️</span> Undo
                </button>
                <button id="routedRedoBtn" class="btn btn-outline" disabled title="Redo (Ctrl+Y)">
                    <span class="icon">↪️</span> Redo
                </button>
            </div>

            <div class="filter-bar">
                <div class="filter-group">
                    <label for="searchRoutedInput">Search:</label>
                    <input type="text" id="searchRoutedInput" class="filter-input" placeholder="Search by subject, sender...">
                </div>
                
                <div class="filter-group">
                    <label for="routedDateFrom">Date From:</label>
                    <input type="date" id="routedDateFrom" class="filter-input">
                </div>

                <div class="filter-group">
                    <label for="routedDateTo">Date To:</label>
                    <input type="date" id="routedDateTo" class="filter-input">
                </div>

                <div class="filter-group">
                    <label style="visibility: hidden;">Action</label>
                    <button id="resetRoutedFiltersBtn" class="btn btn-outline">Reset Filters</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Main Container -->
    <div class="container">


        <!-- Loading Indicator -->
        <div id="loadingIndicator" class="loading-indicator" style="display: none;">
            <div class="spinner"></div>
            <p>Loading data...</p>
        </div>

        <!-- Regular Logs View -->
        <div id="regularLogsView">
            <!-- Table Container -->
            <div class="table-wrapper">
            <table id="logsTable" class="logs-table">
                <thead>
                    <tr>
                        <th class="checkbox-col"><input type="checkbox" id="selectAllCheckbox" class="select-all-checkbox"></th>
                        <th class="sortable id-col" data-field="id">ID <span class="sort-indicator"></span></th>
                        <th class="sortable" data-field="date_created">Date Created <span class="sort-indicator"></span></th>
                        <th class="sortable" data-field="office_campus">Office <span class="sort-indicator"></span></th>
                        <th class="sortable" data-field="forwarded_by">From <span class="sort-indicator"></span></th>
                        <th class="sortable" data-field="doc_type">Type <span class="sort-indicator"></span></th>
                        <th class="sortable title-col" data-field="title">Title <span class="sort-indicator"></span></th>
                        <th class="sortable" data-field="amount">Amount <span class="sort-indicator"></span></th>
                        <th class="sortable" data-field="received_by">Received By <span class="sort-indicator"></span></th>
                        <th class="sortable" data-field="forwarded_to">To <span class="sort-indicator"></span></th>
                        <th class="sortable" data-field="date_received">Date Received <span class="sort-indicator"></span></th>
                        <th class="sortable" data-field="status">Status <span class="sort-indicator"></span></th>
                    </tr>
                </thead>
                <tbody id="tableBody">
                    <tr class="empty-state">
                        <td colspan="12">No records found</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <div class="pagination-controls" id="paginationControls" style="display: none;">
            <div class="pagination-info">
                Showing <span id="pageStart">0</span> to <span id="pageEnd">0</span> of <span id="totalRecords">0</span> entries
            </div>
            <div class="pagination-buttons">
                <button id="prevPageBtn" class="btn btn-outline btn-sm" disabled>Previous</button>
                <span id="currentPageDisplay" class="current-page">Page 1</span>
                <button id="nextPageBtn" class="btn btn-outline btn-sm" disabled>Next</button>
            </div>
        </div>
        </div> <!-- End Regular Logs View -->

        <!-- Routed Logs View -->
        <div id="routedLogsView" style="display: none;">
            <div class="table-wrapper">
                <table id="routedLogsTable" class="logs-table">
                    <thead>
                        <tr>
                            <th class="checkbox-col"><input type="checkbox" id="selectAllRoutedCheckbox" class="select-all-checkbox"></th>
                            <th class="sortable" data-field="doc_date">Date <span class="sort-indicator"></span></th>
                            <th class="sortable" data-field="doc_no">Document No. <span class="sort-indicator"></span></th>
                            <th class="sortable" data-field="sender">Sender/Affiliation <span class="sort-indicator"></span></th>
                            <th class="sortable title-col" data-field="subject">Subject/Title <span class="sort-indicator"></span></th>
                            <th class="sortable" data-field="recipient">Recipient <span class="sort-indicator"></span></th>
                        </tr>
                    </thead>
                    <tbody id="routedTableBody">
                        <tr class="empty-state">
                            <td colspan="6">No records found</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls for Routed -->
            <div class="pagination-controls" id="routedPaginationControls" style="display: none;">
                <div class="pagination-info">
                    Showing <span id="routedPageStart">0</span> to <span id="routedPageEnd">0</span> of <span id="routedTotalRecords">0</span> entries
                </div>
                <div class="pagination-buttons">
                    <button id="routedPrevPageBtn" class="btn btn-outline btn-sm" disabled>Previous</button>
                    <span id="routedCurrentPageDisplay" class="current-page">Page 1</span>
                    <button id="routedNextPageBtn" class="btn btn-outline btn-sm" disabled>Next</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast Notification Container -->
    <div id="toastContainer" class="toast-container"></div>

    <!-- New Entry Modal -->
    <div id="newEntryModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Document Entry</h2>
                <button type="button" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="newEntryForm" class="form-grid">
                    <div class="form-group">
                        <label for="formDateCreated">Date Created *</label>
                        <input type="date" id="formDateCreated" name="date_created" required>
                    </div>

                    <div class="form-group">
                        <label for="formOfficeCampus">Office/Campus *</label>
                        <input type="text" id="formOfficeCampus" name="office_campus" list="officeList" placeholder="Select or type office/campus..." required>
                        <datalist id="officeList">
                            <option value="Office of the University President"></option>
                            <option value="Main"></option>
                            <option value="Ajuy"></option>
                            <option value="Barotac Viejo"></option>
                            <option value="Batad"></option>
                            <option value="Concepcion"></option>
                            <option value="Lemery"></option>
                            <option value="Sara"></option>
                            <option value="OUP"></option>
                            <option value="VPAA"></option>
                            <option value="VPAF"></option>
                            <option value="VPRE"></option>
                            <option value="BOR"></option>
                            <option value="Registrar"></option>
                            <option value="HRMO"></option>
                            <option value="Budget & Accounting"></option>
                            <option value="MIS"></option>
                            <option value="Student Affairs"></option>
                            <option value="NSTP"></option>
                            <option value="OJT Office"></option>
                        </datalist>
                    </div>

                    <div class="form-group">
                        <label for="formForwardedBy">Forwarded By *</label>
                        <input type="text" id="formForwardedBy" name="forwarded_by" required>
                    </div>

                    <div class="form-group">
                        <label for="formDocType">Document Type *</label>
                        <input type="text" id="formDocType" name="doc_type" list="docTypeList" placeholder="Type or select a document type..." required>
                        <datalist id="docTypeList">
                            <option value="Proposal"></option>
                            <option value="Advisory"></option>
                            <option value="Application for Leave"></option>
                            <option value="Approved Budget of Contract"></option>
                            <option value="Authority to Travel"></option>
                            <option value="Certificate"></option>
                            <option value="Clearance"></option>
                            <option value="Contract"></option>
                            <option value="Check"></option>
                            <option value="DTR"></option>
                            <option value="Endorsement/Indorsement"></option>
                            <option value="Itinerary"></option>
                            <option value="Liquidation"></option>
                            <option value="Memorandum"></option>
                            <option value="Memorandum of Agreement"></option>
                            <option value="Monetization"></option>
                            <option value="Notice of Award"></option>
                            <option value="Notice to Proceed"></option>
                            <option value="Notice of Step Increment"></option>
                            <option value="Payroll"></option>
                            <option value="PPMP"></option>
                            <option value="PRE"></option>
                            <option value="Purchase Order"></option>
                            <option value="Purchase Request"></option>
                            <option value="Resolution"></option>
                            <option value="Requisition and Issue Slip"></option>
                            <option value="Transmittal"></option>
                            <option value="Travel Form"></option>
                            <option value="Voucher"></option>
                            <option value="Others"></option>
                        </datalist>
                    </div>

                    <div class="form-group full-width">
                        <label for="formTitle">Title *</label>
                        <input type="text" id="formTitle" name="title" required>
                    </div>

                    <div class="form-group full-width">
                        <label for="formAmount">Amount</label>
                        <input type="number" id="formAmount" name="amount" step="0.01">
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Save Entry</button>
                        <button type="reset" class="btn btn-outline">Clear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Bulk Status Update Modal -->
    <div id="bulkStatusModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Update Status for Selected Entries</h2>
                <button type="button" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="bulkStatusForm" class="form-grid">
                    <div class="form-group full-width">
                        <p style="margin-bottom: 15px; font-weight: 500;">
                            <span id="selectedCountDisplay">0</span> document(s) selected
                        </p>
                    </div>
                    <div class="form-group full-width">
                        <label for="bulkStatusSelect">New Status *</label>
                        <select id="bulkStatusSelect" name="status" required>
                            <option value="">Select New Status...</option>
                            <option value="Pending">Pending</option>
                            <option value="Released">Released</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Disapproved">Disapproved</option>
                            <option value="Forwarded">Forwarded</option>
                            
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Update Status</button>
                        <button type="button" class="btn btn-outline" onclick="closeBulkStatusModal()">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- New Routed Entry Modal -->
    <div id="newRoutedEntryModal" class="modal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Add New Routed Document</h2>
                <button type="button" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="newRoutedEntryForm" class="form-grid">
                    <div class="form-group">
                        <label for="routedDocDate">Date *</label>
                        <input type="date" id="routedDocDate" name="doc_date" required>
                    </div>

                    <div class="form-group">
                        <label for="routedDocNo">Document No. *</label>
                        <input type="text" id="routedDocNo" name="doc_no" required>
                    </div>

                    <div class="form-group full-width">
                        <label for="routedSender">Sender/Affiliation *</label>
                        <input type="text" id="routedSender" name="sender" required>
                    </div>

                    <div class="form-group full-width">
                        <label for="routedSubject">Subject/Title *</label>
                        <input type="text" id="routedSubject" name="subject" required>
                    </div>

                    <div class="form-group full-width">
                        <label for="routedRecipient">Recipient *</label>
                        <input type="text" id="routedRecipient" name="recipient" required>
                    </div>

                    <div class="form-actions">
                        <button type="submit" class="btn btn-primary">Save Entry</button>
                        <button type="reset" class="btn btn-outline">Clear</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal Overlay -->
    <div id="modalOverlay" class="modal-overlay" style="display: none;"></div>

    <script src="js/app.js?v=<?php echo time(); ?>"></script>
</body>
</html>
