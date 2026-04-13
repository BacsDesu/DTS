/**
 * Document Tracking System - JavaScript Application
 * Enhanced with server-side pagination, sorting, authentication, and toast notifications
 */

// Global state
let logs = [];
let selectedIds = new Set();
let currentSort = { field: 'id', direction: 'desc' };
let pagination = {
    page: 1,
    limit: 20,
    totalPages: 1,
    totalRecords: 0
};
let currentFilters = {
    search: '',
    doc_type: '',
    status: '',
    date_from: '',
    date_to: '',
    office: ''
};

// Global state for Routed Logs
let routedLogs = [];
let currentTab = 'regular';
let routedPagination = {
    page: 1,
    limit: 20,
    totalPages: 1,
    totalRecords: 0
};
let routedFilters = {
    search: '',
    date_from: '',
    date_to: ''
};
let selectedRoutedIds = new Set();

// ============================================
// DOM ELEMENTS
// ============================================

const searchInput = document.getElementById('searchInput');
const docTypeFilter = document.getElementById('docTypeFilter');
const statusFilter = document.getElementById('statusFilter');
const dateFromInput = document.getElementById('dateFrom');
const dateToInput = document.getElementById('dateTo');
const officeFilter = document.getElementById('officeFilter');
const resetFiltersBtn = document.getElementById('resetFiltersBtn');
const tableBody = document.getElementById('tableBody');
const logsTable = document.getElementById('logsTable');
const newEntryBtn = document.getElementById('newEntryBtn');
const printBtn = document.getElementById('printBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const bulkStatusBtn = document.getElementById('bulkStatusBtn');
const newEntryModal = document.getElementById('newEntryModal');
const bulkStatusModal = document.getElementById('bulkStatusModal');
const modalOverlay = document.getElementById('modalOverlay');
const newEntryForm = document.getElementById('newEntryForm');
const bulkStatusForm = document.getElementById('bulkStatusForm');
const modalClose = document.querySelector('.modal-close');
const loadingIndicator = document.getElementById('loadingIndicator');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const toastContainer = document.getElementById('toastContainer');

// Routed Logs Elements
const routedLogsView = document.getElementById('routedLogsView');
const regularLogsView = document.getElementById('regularLogsView');
const routedToolbar = document.getElementById('routedToolbar');
const regularToolbar = document.getElementById('regularToolbar');
const searchRoutedInput = document.getElementById('searchRoutedInput');
const routedDateFrom = document.getElementById('routedDateFrom');
const routedDateTo = document.getElementById('routedDateTo');
const resetRoutedFiltersBtn = document.getElementById('resetRoutedFiltersBtn');
const routedTableBody = document.getElementById('routedTableBody');
const routedLogsTable = document.getElementById('routedLogsTable');
const selectAllRoutedCheckbox = document.getElementById('selectAllRoutedCheckbox');
const newRoutedEntryBtn = document.getElementById('newRoutedEntryBtn');
const printRoutedBtn = document.getElementById('printRoutedBtn');
const newRoutedEntryModal = document.getElementById('newRoutedEntryModal');
const newRoutedEntryForm = document.getElementById('newRoutedEntryForm');
const routedPaginationControls = document.getElementById('routedPaginationControls');
const routedPrevPageBtn = document.getElementById('routedPrevPageBtn');
const routedNextPageBtn = document.getElementById('routedNextPageBtn');
const routedPageStartDisplay = document.getElementById('routedPageStart');
const routedPageEndDisplay = document.getElementById('routedPageEnd');
const routedTotalRecordsDisplay = document.getElementById('routedTotalRecords');
const routedCurrentPageDisplay = document.getElementById('routedCurrentPageDisplay');

// Pagination Elements
const paginationControls = document.getElementById('paginationControls');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const pageStartDisplay = document.getElementById('pageStart');
const pageEndDisplay = document.getElementById('pageEnd');
const totalRecordsDisplay = document.getElementById('totalRecords');
const currentPageDisplay = document.getElementById('currentPageDisplay');

// ============================================
// CONSTANTS
// ============================================
const OFFICE_LIST = [
    "Office of the University President",
    "Main",
    "Ajuy",
    "Barotac Viejo",
    "Batad",
    "Concepcion",
    "Lemery",
    "Sara",
    "OUP",
    "VPAA",
    "VPAF",
    "VPRE",
    "BOR",
    "Registrar",
    "HRMO",
    "Budget & Accounting",
    "MIS",
    "Student Affairs",
    "NSTP",
    "OJT Office"
];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    initializeOfficeFilter();
    initializeEventListeners();
    loadLogs();
    loadStats();
});

function initializeOfficeFilter() {
    if (!officeFilter) return;
    
    // Clear existing options except the first one
    while (officeFilter.options.length > 1) {
        officeFilter.remove(1);
    }
    
    // Populate with predefined list
    OFFICE_LIST.forEach(office => {
        const option = document.createElement('option');
        option.value = office;
        option.textContent = office;
        officeFilter.appendChild(option);
    });
}

function initializeEventListeners() {
    // Filter events
    searchInput.addEventListener('input', debounce(handleFilterChange, 300));
    docTypeFilter.addEventListener('change', handleFilterChange);
    statusFilter.addEventListener('change', handleFilterChange);
    dateFromInput.addEventListener('change', handleFilterChange);
    dateToInput.addEventListener('change', handleFilterChange);
    officeFilter.addEventListener('change', handleFilterChange);
    resetFiltersBtn.addEventListener('click', resetFilters);

    // Modal events
    newEntryBtn.addEventListener('click', openModal);
    
    // Fix: Attach event listeners to all close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });
    
    if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
    newEntryForm.addEventListener('submit', handleNewEntry);
    bulkStatusForm.addEventListener('submit', handleBulkStatusUpdate);

    // Action events
    printBtn.addEventListener('click', printTable);
    bulkStatusBtn.addEventListener('click', openBulkStatusModal);

    // Undo/Redo events
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const routedUndoBtn = document.getElementById('routedUndoBtn');
    const routedRedoBtn = document.getElementById('routedRedoBtn');

    if (undoBtn) undoBtn.addEventListener('click', performUndo);
    if (redoBtn) redoBtn.addEventListener('click', performRedo);
    if (routedUndoBtn) routedUndoBtn.addEventListener('click', performUndo);
    if (routedRedoBtn) routedRedoBtn.addEventListener('click', performRedo);

    // Keyboard shortcuts for Undo/Redo
    document.addEventListener('keydown', function(e) {
        // Ignore if user is typing in an input field (let browser handle text undo/redo)
        if (e.target.matches('input, textarea, select') || e.target.isContentEditable) {
            return;
        }

        if (e.ctrlKey || e.metaKey) {
            // Undo: Ctrl+Z
            if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
                e.preventDefault();
                performUndo();
            }
            // Redo: Ctrl+Y or Ctrl+Shift+Z
            else if (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey)) {
                e.preventDefault();
                performRedo();
            }
        }
    });

    // Checkbox events
    if (selectAllCheckbox) selectAllCheckbox.addEventListener('change', toggleSelectAll);

    // Column sorting
    document.addEventListener('click', function (e) {
        if (e.target.closest('.sortable')) {
            const th = e.target.closest('.sortable');
            const field = th.dataset.field;
            handleSort(field);
        }
    });

    // Pagination events
    if (prevPageBtn) prevPageBtn.addEventListener('click', () => changePage(pagination.page - 1));
    if (nextPageBtn) nextPageBtn.addEventListener('click', () => changePage(pagination.page + 1));

    // Routed Logs Listeners
    if (searchRoutedInput) searchRoutedInput.addEventListener('input', debounce(handleRoutedFilterChange, 300));
    if (routedDateFrom) routedDateFrom.addEventListener('change', handleRoutedFilterChange);
    if (routedDateTo) routedDateTo.addEventListener('change', handleRoutedFilterChange);
    if (resetRoutedFiltersBtn) resetRoutedFiltersBtn.addEventListener('click', resetRoutedFilters);
    if (newRoutedEntryBtn) newRoutedEntryBtn.addEventListener('click', openRoutedModal);
    if (newRoutedEntryForm) newRoutedEntryForm.addEventListener('submit', handleNewRoutedEntry);
    if (routedPrevPageBtn) routedPrevPageBtn.addEventListener('click', () => changeRoutedPage(routedPagination.page - 1));
    if (routedNextPageBtn) routedNextPageBtn.addEventListener('click', () => changeRoutedPage(routedPagination.page + 1));
    if (selectAllRoutedCheckbox) selectAllRoutedCheckbox.addEventListener('change', toggleSelectAllRouted);
}

// ============================================
// TAB FUNCTIONALITY
// ============================================

function switchTab(tab) {
    currentTab = tab;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const isActive = btn.getAttribute('onclick').includes(`'${tab}'`);
        if (isActive) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (tab === 'regular') {
        if(regularLogsView) regularLogsView.style.display = 'block';
        if(routedLogsView) routedLogsView.style.display = 'none';
        if(regularToolbar) regularToolbar.style.display = 'block';
        if(routedToolbar) routedToolbar.style.display = 'none';
        loadLogs();
    } else {
        if(regularLogsView) regularLogsView.style.display = 'none';
        if(routedLogsView) routedLogsView.style.display = 'block';
        if(regularToolbar) regularToolbar.style.display = 'none';
        if(routedToolbar) routedToolbar.style.display = 'block';
        loadRoutedLogs();
    }
}

// ============================================
// SORTING FUNCTIONALITY
// ============================================

function handleSort(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }

    updateSortIndicators();
    loadLogs(); // Reload from server with new sort
}

function updateSortIndicators() {
    document.querySelectorAll('.sort-indicator').forEach(indicator => {
        indicator.textContent = '';
    });

    if (currentSort.field) {
        const th = document.querySelector(`th[data-field="${currentSort.field}"]`);
        if (th) {
            const indicator = th.querySelector('.sort-indicator');
            if (indicator) {
                indicator.textContent = currentSort.direction === 'asc' ? '↑' : '↓';
            }
        }
    }
}

// ============================================
// UNDO/REDO SYSTEM
// ============================================

const undoStack = [];
const redoStack = [];

function recordAction(action) {
    undoStack.push(action);
    redoStack.length = 0; // Clear redo stack on new action
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const routedUndoBtn = document.getElementById('routedUndoBtn');
    const routedRedoBtn = document.getElementById('routedRedoBtn');
    
    const hasUndo = undoStack.length > 0;
    const hasRedo = redoStack.length > 0;

    if (undoBtn) undoBtn.disabled = !hasUndo;
    if (redoBtn) redoBtn.disabled = !hasRedo;
    if (routedUndoBtn) routedUndoBtn.disabled = !hasUndo;
    if (routedRedoBtn) routedRedoBtn.disabled = !hasRedo;
}

async function performUndo() {
    if (undoStack.length === 0) return;

    const action = undoStack.pop();
    redoStack.push(action); // Move to redo stack
    updateUndoRedoButtons();

    showLoadingIndicator();

    try {
        const apiAction = action.apiAction || 'update'; // Default to regular update
        
        if (action.type === 'update') {
            await fetchWithAuth(`api.php?action=${apiAction}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: action.id, field: action.field, value: action.oldValue })
            });
        } else if (action.type === 'batch_update') {
            const updates = action.changes.map(change => {
                return fetchWithAuth(`api.php?action=${apiAction}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: change.id, field: change.field, value: change.oldValue })
                });
            });
            await Promise.all(updates);
        }
        
        showToast('Undo successful', 'success');
        if (action.table === 'routed') {
            loadRoutedLogs();
        } else {
            loadLogs();
            loadStats();
        }
    } catch (error) {
        console.error('Undo failed:', error);
        showToast('Undo failed', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

async function performRedo() {
    if (redoStack.length === 0) return;

    const action = redoStack.pop();
    undoStack.push(action); // Move back to undo stack
    updateUndoRedoButtons();

    showLoadingIndicator();

    try {
        const apiAction = action.apiAction || 'update';

        if (action.type === 'update') {
            await fetchWithAuth(`api.php?action=${apiAction}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: action.id, field: action.field, value: action.newValue })
            });
        } else if (action.type === 'batch_update') {
            const updates = action.changes.map(change => {
                return fetchWithAuth(`api.php?action=${apiAction}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: change.id, field: change.field, value: change.newValue })
                });
            });
            await Promise.all(updates);
        }

        showToast('Redo successful', 'success');
        if (action.table === 'routed') {
            loadRoutedLogs();
        } else {
            loadLogs();
            loadStats();
        }
    } catch (error) {
        console.error('Redo failed:', error);
        showToast('Redo failed', 'error');
    } finally {
        hideLoadingIndicator();
    }
}

// ============================================
// FILTER FUNCTIONS
// ============================================

function handleFilterChange() {
    currentFilters.search = searchInput.value;
    currentFilters.doc_type = docTypeFilter.value;
    currentFilters.status = statusFilter.value;
    currentFilters.date_from = dateFromInput.value;
    currentFilters.date_to = dateToInput.value;
    currentFilters.office = officeFilter.value;

    pagination.page = 1; // Reset to first page on filter change
    loadLogs();
}

function resetFilters() {
    searchInput.value = '';
    docTypeFilter.value = '';
    statusFilter.value = '';
    dateFromInput.value = '';
    dateToInput.value = '';
    officeFilter.value = '';
    
    currentFilters = {
        search: '',
        doc_type: '',
        status: '',
        date_from: '',
        date_to: '',
        office: ''
    };
    currentSort = { field: 'id', direction: 'desc' };
    pagination.page = 1;
    selectedIds.clear();
    if (selectAllCheckbox) selectAllCheckbox.checked = false;
    
    updateSortIndicators();
    loadLogs();
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ============================================
// AJAX FUNCTIONS
// ============================================

async function fetchWithAuth(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (response.status === 401) {
            window.location.href = 'login.php';
            return null;
        }
        return response;
    } catch (error) {
        throw error;
    }
}

function loadLogs() {
    showLoadingIndicator();

    const params = new URLSearchParams({
        action: 'fetch_all',
        page: pagination.page,
        limit: pagination.limit,
        sort_field: currentSort.field,
        sort_dir: currentSort.direction,
        search: currentFilters.search,
        doc_type: currentFilters.doc_type,
        status: currentFilters.status,
        date_from: currentFilters.date_from,
        date_to: currentFilters.date_to,
        office: currentFilters.office
    });

    fetchWithAuth(`api.php?${params}`)
        .then(response => response ? response.json() : null)
        .then(data => {
            if (!data) return; // Auth redirect happened

            if (data.success) {
                logs = data.data;
                
                // Update pagination state
                if (data.pagination) {
                    pagination.page = parseInt(data.pagination.current_page);
                    pagination.totalPages = parseInt(data.pagination.total_pages);
                    pagination.totalRecords = parseInt(data.pagination.total_records);
                }
                
                renderTable();
                updatePaginationControls();
            } else {
                showToast(data.error || 'Failed to load logs', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Failed to load logs', 'error');
        })
        .finally(() => hideLoadingIndicator());
}

/**
 * Load dashboard statistics
 */
async function loadStats() {
    try {
        const response = await fetchWithAuth('api.php?action=fetch_stats');
        if (!response) return;

        const data = await response.json();
        
        if (data.success) {
            // Update total
            const totalEl = document.getElementById('statTotal');
            if (totalEl) totalEl.textContent = data.data.total;
            
            // Update individual status counts
            const counts = data.data.counts;
            
            const statusMap = {
                'Pending': 'statPending',
                'Released': 'statReleased',
                'Delivered': 'statDelivered',
                'Disapproved': 'statDisapproved',
                'Forwarded': 'statForwarded',
                'Outgoing': 'statOutgoing'
            };
            
            for (const [status, elementId] of Object.entries(statusMap)) {
                const element = document.getElementById(elementId);
                if (element) {
                    element.textContent = counts[status] || 0;
                }
            }
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ============================================
// PAGINATION
// ============================================

function changePage(newPage) {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    pagination.page = newPage;
    loadLogs();
}

function updatePaginationControls() {
    if (!paginationControls) return;

    paginationControls.style.display = 'flex';
    
    const start = (pagination.page - 1) * pagination.limit + 1;
    const end = Math.min(pagination.page * pagination.limit, pagination.totalRecords);
    
    if (pageStartDisplay) pageStartDisplay.textContent = pagination.totalRecords > 0 ? start : 0;
    if (pageEndDisplay) pageEndDisplay.textContent = end;
    if (totalRecordsDisplay) totalRecordsDisplay.textContent = pagination.totalRecords;
    
    if (currentPageDisplay) currentPageDisplay.textContent = `Page ${pagination.page}`;
    
    if (prevPageBtn) prevPageBtn.disabled = pagination.page <= 1;
    if (nextPageBtn) nextPageBtn.disabled = pagination.page >= pagination.totalPages;
}

// ============================================
// TABLE RENDERING
// ============================================

function renderTable() {
    if (!tableBody) return;

    if (logs.length === 0) {
        tableBody.innerHTML = '<tr class="empty-state"><td colspan="12">No records found</td></tr>';
        return;
    }

    tableBody.innerHTML = logs.map(log => createTableRow(log)).join('');

    // Add event listeners
    document.querySelectorAll('.row-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange);
    });

    // Unified click/dblclick for all editable cells
    document.querySelectorAll('.logs-table tbody td.editable').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
        cell.addEventListener('dblclick', handleCellDblClick);
    });
    
    updateTableRowSelection();
}

// ============================================
// FILL HANDLE & CELL SELECTION
// ============================================

let isDraggingHandle = false;
let dragStartCell = null;
let dragSelectedCells = [];

function handleCellClick(e) {
    // If clicking inside an input/select, do nothing (let default behavior happen)
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (this.querySelector('input, select')) return;

    // Deselect all other cells
    document.querySelectorAll('.selected-cell').forEach(c => {
        c.classList.remove('selected-cell');
        const handle = c.querySelector('.fill-handle');
        if (handle) handle.remove();
    });

    // Select this cell
    this.classList.add('selected-cell');

    // Add fill handle
    const handle = document.createElement('div');
    handle.className = 'fill-handle';
    handle.addEventListener('mousedown', handleDragStart);
    this.appendChild(handle);
}

function handleCellDblClick(e) {
    if (this.querySelector('input, select')) return;
    makeEditable(this);
    // Remove selection styling when editing starts
    this.classList.remove('selected-cell');
    const handle = this.querySelector('.fill-handle');
    if (handle) handle.remove();
}

function handleDragStart(e) {
    e.stopPropagation(); // Prevent cell click bubbling
    e.preventDefault(); // Prevent text selection
    
    isDraggingHandle = true;
    dragStartCell = this.parentElement;
    dragSelectedCells = [];

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
}

function handleDragMove(e) {
    if (!isDraggingHandle || !dragStartCell) return;

    const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
    const targetCell = elementUnder ? elementUnder.closest('td.editable') : null;

    // Clear previous drag selection
    document.querySelectorAll('.drag-selected').forEach(c => c.classList.remove('drag-selected'));
    dragSelectedCells = [];

    if (!targetCell) return;

    // Must be in the same column
    if (targetCell.dataset.field !== dragStartCell.dataset.field) return;

    // Identify rows
    const startRow = dragStartCell.parentElement;
    const targetRow = targetCell.parentElement;
    const allRows = Array.from(dragStartCell.closest('tbody').querySelectorAll('tr'));
    
    const startIndex = allRows.indexOf(startRow);
    const targetIndex = allRows.indexOf(targetRow);

    if (startIndex === -1 || targetIndex === -1) return;

    // Determine range (min to max)
    const minIndex = Math.min(startIndex, targetIndex);
    const maxIndex = Math.max(startIndex, targetIndex);

    // Highlight cells in range (excluding start cell if we want, but usually included in visual)
    // Actually standard is: select start cell -> drag -> highlight *target* cells.
    // We'll highlight everything in the range except the start cell for visual clarity of what's changing?
    // Or just highlight everything. Let's highlight everything to show scope.

    for (let i = minIndex; i <= maxIndex; i++) {
        if (i === startIndex) continue; // Don't highlight the source cell as "to be changed"
        const row = allRows[i];
        const cell = row.querySelector(`td[data-field="${dragStartCell.dataset.field}"]`);
        if (cell) {
            cell.classList.add('drag-selected');
            dragSelectedCells.push(cell);
        }
    }
}

function handleDragEnd(e) {
    if (!isDraggingHandle) return;

    isDraggingHandle = false;
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);

    if (dragSelectedCells.length > 0) {
        // Perform the update
        const sourceValue = dragStartCell.innerText.trim(); // Or get data from logs array for precision
        const field = dragStartCell.dataset.field;
        
        // Use logs array to get raw value (better for amounts, dates, etc)
        const startId = dragStartCell.dataset.id;
        const sourceLog = logs.find(l => l.id == startId);
        const rawValue = sourceLog ? sourceLog[field] : sourceValue;

        // Optimistic UI update
        dragSelectedCells.forEach(cell => {
            cell.innerText = sourceValue; // Update visual immediately
            cell.classList.add('updating'); // Optional: add a class to show it's saving
        });

        // Batch API Update
        // Capture old values for Undo
        const undoChanges = dragSelectedCells.map(cell => {
            const id = cell.dataset.id;
            const log = logs.find(l => l.id == id);
            return {
                id: id,
                field: field,
                oldValue: log ? log[field] : null,
                newValue: rawValue
            };
        });

        const updates = dragSelectedCells.map(cell => {
            const id = cell.dataset.id;
            return fetchWithAuth('api.php?action=update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, field, value: rawValue })
            }).then(r => r ? r.json() : null);
        });

        showLoadingIndicator();

        Promise.all(updates)
            .then(results => {
                const successes = results.filter(r => r && r.success).length;
                if (successes > 0) {
                    showToast(`Updated ${successes} cells`, 'success');
                    
                    // Record batch action for undo
                    if (undoChanges.length > 0) {
                        recordAction({
                            type: 'batch_update',
                            changes: undoChanges
                        });
                    }

                    // Reload to ensure consistency (and refresh data array)
                    loadLogs(); 
                    loadStats();
                } else {
                    showToast('Failed to update cells', 'error');
                    loadLogs(); // Revert
                }
            })
            .catch(err => {
                console.error(err);
                showToast('Error updating cells', 'error');
                loadLogs();
            })
            .finally(() => {
                hideLoadingIndicator();
            });
    }

    // Cleanup
    document.querySelectorAll('.drag-selected').forEach(c => c.classList.remove('drag-selected'));
    dragSelectedCells = [];
    dragStartCell = null;
}

function createTableRow(log) {
    const statusBadgeClass = `status-${(log.status || 'pending').toLowerCase().replace(' ', '-')}`;
    const isSelected = selectedIds.has(log.id);

    return `
        <tr data-id="${log.id}" class="${isSelected ? 'selected' : ''}">
            <td class="checkbox-col"><input type="checkbox" class="row-checkbox" data-id="${log.id}" ${isSelected ? 'checked' : ''}></td>
            <td class="id-col">${log.id}</td>
            <td class="editable" data-field="date_created" data-id="${log.id}">${log.date_created || ''}</td>
            <td class="editable" data-field="office_campus" data-id="${log.id}">${log.office_campus || ''}</td>
            <td class="editable" data-field="forwarded_by" data-id="${log.id}">${log.forwarded_by || ''}</td>
            <td class="editable" data-field="doc_type" data-id="${log.id}">
                <span class="doc-type-display">${log.doc_type || ''}</span>
            </td>
            <td class="editable title-col" data-field="title" data-id="${log.id}">${log.title || ''}</td>
            <td class="editable" data-field="amount" data-id="${log.id}">${log.amount ? parseFloat(log.amount).toFixed(2) : '0.00'}</td>
            <td class="editable" data-field="received_by" data-id="${log.id}">${log.received_by || ''}</td>
            <td class="editable" data-field="forwarded_to" data-id="${log.id}">${log.forwarded_to || ''}</td>
            <td class="editable" data-field="date_received" data-id="${log.id}">${log.date_received || '-'}</td>
            <td class="editable" data-field="status" data-id="${log.id}">
                <span class="status-badge ${statusBadgeClass}">${log.status || 'Pending'}</span>
            </td>
        </tr>
    `;
}

// ============================================
// CHECKBOX & BULK OPERATIONS
// ============================================

function handleCheckboxChange(e) {
    const id = parseInt(e.target.dataset.id);
    if (e.target.checked) {
        selectedIds.add(id);
    } else {
        selectedIds.delete(id);
    }
    updateBulkButton();
    updateTableRowSelection();
}

function toggleSelectAll(e) {
    if (e.target.checked) {
        logs.forEach(log => selectedIds.add(log.id));
    } else {
        // Only deselect items on the current page
        logs.forEach(log => selectedIds.delete(log.id));
    }
    updateBulkButton();
    updateTableRowSelection();
}

function updateBulkButton() {
    if (bulkStatusBtn) bulkStatusBtn.style.display = selectedIds.size > 0 ? 'inline-flex' : 'none';
}

function updateTableRowSelection() {
    document.querySelectorAll('.logs-table tbody tr').forEach(row => {
        const id = parseInt(row.dataset.id);
        if (selectedIds.has(id)) {
            row.classList.add('selected');
            const checkbox = row.querySelector('.row-checkbox');
            if (checkbox) checkbox.checked = true;
        } else {
            row.classList.remove('selected');
            const checkbox = row.querySelector('.row-checkbox');
            if (checkbox) checkbox.checked = false;
        }
    });
}

function openBulkStatusModal() {
    const countDisplay = document.getElementById('selectedCountDisplay');
    if (countDisplay) countDisplay.textContent = selectedIds.size;
    if (bulkStatusModal) bulkStatusModal.style.display = 'block';
    if (modalOverlay) modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function handleBulkStatusUpdate(e) {
    e.preventDefault();

    const newStatus = document.getElementById('bulkStatusSelect').value;
    if (!newStatus) {
        showToast('Please select a status', 'error');
        return;
    }

    showLoadingIndicator();

    const updatePromises = Array.from(selectedIds).map(id => {
        return fetchWithAuth('api.php?action=update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, field: 'status', value: newStatus })
        }).then(r => r ? r.json() : null);
    });

    Promise.all(updatePromises)
        .then(results => {
            const validResults = results.filter(r => r !== null);
            if (validResults.every(r => r.success)) {
                if (bulkStatusModal) bulkStatusModal.style.display = 'none';
                if (modalOverlay) modalOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                if (bulkStatusForm) bulkStatusForm.reset();
                
                selectedIds.clear();
                if (selectAllCheckbox) selectAllCheckbox.checked = false;
                loadLogs();
                loadStats();
                showToast(`Updated ${validResults.length} records successfully`, 'success');
            } else {
                showToast('Some updates failed', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Failed to update records', 'error');
        })
        .finally(() => hideLoadingIndicator());
}

// ============================================
// INLINE EDITING
// ============================================

function makeEditable(cell) {
    const field = cell.dataset.field;
    const id = cell.dataset.id;
    const log = logs.find(l => l.id == id);
    if (!log) return;
    
    const currentValue = log[field];

    let inputHTML = '';

    if (field === 'date_created' || field === 'date_received') {
        inputHTML = `<input type="date" class="edit-input" value="${currentValue || ''}" data-field="${field}" data-id="${id}">`;
    } else if (field === 'amount') {
        inputHTML = `<input type="number" class="edit-input" step="0.01" value="${currentValue}" data-field="${field}" data-id="${id}">`;
    } else if (field === 'doc_type') {
         inputHTML = `
            <select class="edit-input" data-field="${field}" data-id="${id}">
                ${['Proposal','Advisory','Application for Leave','Approved Budget of Contract','Authority to Travel','Certificate','Clearance','Contract','Check','DTR','Endorsement/Indorsement','Itinerary','Liquidation','Memorandum','Memorandum of Agreement','Monetization','Notice of Award','Notice to Proceed','Notice of Step Increment','Payroll','PPMP','PRE','Purchase Order','Purchase Request','Resolution','Requisition and Issue Slip','Transmittal','Travel Form','Voucher','Others']
                .map(type => `<option value="${type}" ${currentValue === type ? 'selected' : ''}>${type}</option>`).join('')}
            </select>
        `;
    } else if (field === 'office_campus') {
        inputHTML = `<input type="text" class="edit-input" list="officeList" value="${currentValue || ''}" data-field="${field}" data-id="${id}">`;
    } else if (field === 'status') {
         inputHTML = `
            <select class="edit-input" data-field="${field}" data-id="${id}">
                ${['Pending', 'Released','Delivered','Disapproved','Forwarded']
                .map(status => `<option value="${status}" ${currentValue === status ? 'selected' : ''}>${status}</option>`).join('')}
            </select>
        `;
    } else {
        inputHTML = `<input type="text" class="edit-input" value="${currentValue || ''}" data-field="${field}" data-id="${id}">`;
    }

    cell.innerHTML = inputHTML;
    cell.classList.add('editing');
    
    const input = cell.querySelector('.edit-input');
    if (input) {
        input.focus();

        // Move caret to end for text inputs
        if (input.type === 'text' && input.value) {
            input.setSelectionRange(input.value.length, input.value.length);
        }

        // Auto-open date/select picker if available
        if ((input.type === 'date' || input.tagName === 'SELECT') && 'showPicker' in HTMLInputElement.prototype) {
            try {
                input.showPicker();
            } catch (err) {
                console.warn('Could not open picker:', err);
            }
        }

        // Handle save on blur or enter
        const saveHandler = function() {
            const newValue = input.value;
            if (newValue !== String(currentValue)) {
                updateLog(id, field, newValue, currentValue);
            } else {
                renderTable(); // Revert
            }
        };

        input.addEventListener('blur', saveHandler);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }
}

function updateLog(id, field, value, oldValue = null) {
    // If oldValue not passed, try to find it
    if (oldValue === null) {
        const log = logs.find(l => l.id == id);
        if (log) oldValue = log[field];
    }

    fetchWithAuth('api.php?action=update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value })
    })
    .then(response => response ? response.json() : null)
    .then(data => {
        if (!data) return;

        if (data.success) {
            showToast('Record updated successfully', 'success');
            // Record action for undo
            recordAction({
                type: 'update',
                id: id,
                field: field,
                oldValue: oldValue,
                newValue: value
            });
            loadLogs(); // Reload to refresh data
            loadStats();
        } else {
            showToast(data.error || 'Update failed', 'error');
            renderTable(); // Revert
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Update failed', 'error');
        renderTable();
    });
}

// ============================================
// NEW ENTRY
// ============================================

function openModal() {
    if (newEntryModal) newEntryModal.style.display = 'block';
    if (modalOverlay) modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Set default date to current date
    const dateInput = document.getElementById('formDateCreated');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
}

function closeModal() {
    if (newEntryModal) newEntryModal.style.display = 'none';
    if (newRoutedEntryModal) newRoutedEntryModal.style.display = 'none';
    if (bulkStatusModal) bulkStatusModal.style.display = 'none';
    if (modalOverlay) modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (newEntryForm) newEntryForm.reset();
    if (newRoutedEntryForm) newRoutedEntryForm.reset();
}

function handleNewEntry(e) {
    e.preventDefault();
    
    const formData = new FormData(newEntryForm);
    const data = Object.fromEntries(formData.entries());
    
    showLoadingIndicator();
    
    fetchWithAuth('api.php?action=insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response ? response.json() : null)
    .then(data => {
        if (!data) return;

        if (data.success) {
            closeModal();
            showToast('New entry added successfully', 'success');
            loadLogs();
            loadStats();
        } else {
            showToast(data.error || 'Failed to add entry', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Failed to add entry', 'error');
    })
    .finally(() => hideLoadingIndicator());
}

// ============================================
// UTILITIES
// ============================================

function showToast(message, type = 'info') {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Trigger reflow
    toast.offsetHeight;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showLoadingIndicator() {
    if (loadingIndicator) loadingIndicator.style.display = 'flex';
}

function hideLoadingIndicator() {
    if (loadingIndicator) loadingIndicator.style.display = 'none';
}

function printTable() {
    const img = document.querySelector('.nisu-logo');
    if (img) {
        const triggerPrint = () => setTimeout(() => window.print(), 50);
        if (!img.complete) {
            const onLoad = () => {
                img.removeEventListener('load', onLoad);
                triggerPrint();
            };
            img.addEventListener('load', onLoad);
            try {
                const src = img.getAttribute('src') || '';
                img.setAttribute('src', src + (src.includes('?') ? '&' : '?') + 'v=' + Date.now());
            } catch (e) {
                triggerPrint();
            }
        } else {
            triggerPrint();
        }
    } else {
        setTimeout(() => window.print(), 50);
    }
}

function exportToCSV() {
    // Export ALL records matching current filter (not just current page)
    // We might need a separate API endpoint for this or just fetch all with high limit
    // For now, let's just export what we have in memory (current page) to keep it simple,
    // or fetch all. Fetching all is better.
    
    const params = new URLSearchParams({
        action: 'fetch_all',
        limit: 10000, // Large limit for export
        sort_field: currentSort.field,
        sort_dir: currentSort.direction,
        search: currentFilters.search,
        doc_type: currentFilters.doc_type,
        status: currentFilters.status,
        date_from: currentFilters.date_from,
        date_to: currentFilters.date_to,
        office: currentFilters.office
    });

    showLoadingIndicator();

    fetchWithAuth(`api.php?${params}`)
        .then(response => response ? response.json() : null)
        .then(data => {
            if (data && data.success) {
                downloadCSV(data.data);
            } else {
                showToast('Failed to export data', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Failed to export data', 'error');
        })
        .finally(() => hideLoadingIndicator());
}

function downloadCSV(data) {
    if (!data || !data.length) {
        showToast('No data to export', 'info');
        return;
    }

    const headers = ['ID', 'Date Created', 'Office/Campus', 'Forwarded By', 'Doc Type', 'Title', 'Amount', 'Received By', 'Forwarded To', 'Date Received', 'Status'];
    const keys = ['id', 'date_created', 'office_campus', 'forwarded_by', 'doc_type', 'title', 'amount', 'received_by', 'forwarded_to', 'date_received', 'status'];

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\r\n";

    data.forEach(row => {
        const rowData = keys.map(key => {
            let val = row[key] || '';
            // Escape quotes and wrap in quotes if contains comma
            val = String(val).replace(/"/g, '""');
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                val = `"${val}"`;
            }
            return val;
        });
        csvContent += rowData.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dts_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// ============================================
// ROUTED LOGS FUNCTIONALITY
// ============================================

function handleRoutedFilterChange() {
    routedFilters.search = searchRoutedInput.value;
    routedFilters.date_from = routedDateFrom.value;
    routedFilters.date_to = routedDateTo.value;
    routedPagination.page = 1;
    loadRoutedLogs();
}

function resetRoutedFilters() {
    searchRoutedInput.value = '';
    routedDateFrom.value = '';
    routedDateTo.value = '';
    routedFilters = { search: '', date_from: '', date_to: '' };
    routedPagination.page = 1;
    loadRoutedLogs();
}

function loadRoutedLogs() {
    showLoadingIndicator();

    const params = new URLSearchParams({
        action: 'fetch_routed',
        page: routedPagination.page,
        limit: routedPagination.limit,
        search: routedFilters.search,
        date_from: routedFilters.date_from,
        date_to: routedFilters.date_to
    });

    fetchWithAuth(`api.php?${params}`)
        .then(response => response ? response.json() : null)
        .then(data => {
            if (!data) return;

            if (data.success) {
                routedLogs = data.data;
                if (data.pagination) {
                    routedPagination.page = parseInt(data.pagination.current_page);
                    routedPagination.totalPages = parseInt(data.pagination.total_pages);
                    routedPagination.totalRecords = parseInt(data.pagination.total_records);
                }
                renderRoutedTable();
                updateRoutedPaginationControls();
            } else {
                showToast(data.error || 'Failed to load routed logs', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('Failed to load routed logs', 'error');
        })
        .finally(() => hideLoadingIndicator());
}

function renderRoutedTable() {
    if (!routedTableBody) return;

    if (routedLogs.length === 0) {
        routedTableBody.innerHTML = '<tr class="empty-state"><td colspan="6">No records found</td></tr>';
        return;
    }

    routedTableBody.innerHTML = routedLogs.map(log => createRoutedTableRow(log)).join('');

    // Add event listeners for editing
    document.querySelectorAll('#routedLogsTable tbody td.editable').forEach(cell => {
        const field = cell.dataset.field;
        // Double click for date, single for others (consistent with regular logs)
        if (field === 'doc_date') {
            cell.addEventListener('dblclick', function (e) {
                if (!this.querySelector('input')) {
                    makeRoutedEditable(this);
                }
            });
        } else {
            cell.addEventListener('click', function (e) {
                if (!this.querySelector('input')) {
                    makeRoutedEditable(this);
                }
            });
        }
    });
}

function createRoutedTableRow(log) {
    const isSelected = selectedRoutedIds.has(String(log.id));
    return `
        <tr data-id="${log.id}" class="${isSelected ? 'selected' : ''}">
            <td class="checkbox-col">
                <input type="checkbox" class="row-checkbox routed-checkbox" value="${log.id}" ${isSelected ? 'checked' : ''} onchange="toggleRoutedRowSelection(this)">
            </td>
            <td class="editable" data-field="doc_date" data-id="${log.id}">${log.doc_date || ''}</td>
            <td class="editable" data-field="doc_no" data-id="${log.id}">${log.doc_no || ''}</td>
            <td class="editable" data-field="sender" data-id="${log.id}">${log.sender || ''}</td>
            <td class="editable title-col" data-field="subject" data-id="${log.id}">${log.subject || ''}</td>
            <td class="editable" data-field="recipient" data-id="${log.id}">${log.recipient || ''}</td>
        </tr>
    `;
}

function toggleSelectAllRouted() {
    const checkboxes = document.querySelectorAll('.routed-checkbox');
    const isChecked = selectAllRoutedCheckbox.checked;

    checkboxes.forEach(cb => {
        cb.checked = isChecked;
        const row = cb.closest('tr');
        if (isChecked) {
            selectedRoutedIds.add(cb.value);
            row.classList.add('selected');
        } else {
            selectedRoutedIds.delete(cb.value);
            row.classList.remove('selected');
        }
    });
}

function toggleRoutedRowSelection(checkbox) {
    const row = checkbox.closest('tr');
    if (checkbox.checked) {
        selectedRoutedIds.add(checkbox.value);
        row.classList.add('selected');
    } else {
        selectedRoutedIds.delete(checkbox.value);
        row.classList.remove('selected');
    }
    
    // Update select all checkbox state
    const allCheckboxes = document.querySelectorAll('.routed-checkbox');
    const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
    if (selectAllRoutedCheckbox) selectAllRoutedCheckbox.checked = allChecked;
    if (!checkbox.checked && selectAllRoutedCheckbox) selectAllRoutedCheckbox.indeterminate = selectedRoutedIds.size > 0;
}

function openRoutedModal() {
    if (newRoutedEntryModal) newRoutedEntryModal.style.display = 'block';
    if (modalOverlay) modalOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Set default date
    const dateInput = document.getElementById('routedDocDate');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
}

function handleNewRoutedEntry(e) {
    e.preventDefault();
    
    const formData = new FormData(newRoutedEntryForm);
    const data = Object.fromEntries(formData.entries());
    
    // Add pending status by default if not set
    if (!data.status) data.status = 'Pending';

    showLoadingIndicator();

    fetchWithAuth('api.php?action=insert_routed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response ? response.json() : null)
    .then(result => {
        if (result && result.success) {
            showToast('Routed entry added successfully', 'success');
            closeModal();
            loadRoutedLogs();
        } else {
            showToast(result.error || 'Failed to add entry', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('An error occurred', 'error');
    })
    .finally(() => hideLoadingIndicator());
}

function makeRoutedEditable(cell) {
    const field = cell.dataset.field;
    const id = cell.dataset.id;
    const log = routedLogs.find(l => l.id == id);
    if (!log) return;
    
    const currentValue = log[field];
    let inputHTML = '';

    if (field === 'doc_date') {
        inputHTML = `<input type="date" class="edit-input" value="${currentValue || ''}" data-field="${field}" data-id="${id}">`;
    } else {
        // Text input for others
        inputHTML = `<input type="text" class="edit-input" value="${currentValue || ''}" data-field="${field}" data-id="${id}">`;
    }

    cell.innerHTML = inputHTML;
    cell.classList.add('editing');
    
    const input = cell.querySelector('.edit-input');
    if (input) {
        input.focus();
        if (input.type === 'text' && input.value) {
             input.setSelectionRange(input.value.length, input.value.length);
        }
        
        // Save handler
        const saveHandler = function() {
            const newValue = input.value;
            if (newValue !== String(currentValue)) {
                updateRoutedLog(id, field, newValue, currentValue);
            } else {
                renderRoutedTable(); // Revert
            }
        };

        input.addEventListener('blur', saveHandler);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                input.blur();
            }
        });
    }
}

function updateRoutedLog(id, field, value, oldValue = null) {
    // If oldValue not passed, try to find it
    if (oldValue === null) {
        const log = routedLogs.find(l => l.id == id);
        if (log) oldValue = log[field];
    }

    fetchWithAuth('api.php?action=update_routed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, field, value })
    })
    .then(response => response ? response.json() : null)
    .then(data => {
        if (data && data.success) {
            showToast('Record updated successfully', 'success');
            // Record action for undo
            recordAction({
                type: 'update',
                table: 'routed',
                apiAction: 'update_routed',
                id: id,
                field: field,
                oldValue: oldValue,
                newValue: value
            });
            loadRoutedLogs();
        } else {
            showToast(data.error || 'Update failed', 'error');
            renderRoutedTable();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Update failed', 'error');
        renderRoutedTable();
    });
}

function changeRoutedPage(newPage) {
    if (newPage < 1 || newPage > routedPagination.totalPages) return;
    routedPagination.page = newPage;
    loadRoutedLogs();
}

function updateRoutedPaginationControls() {
    if (!routedPaginationControls) return;

    routedPaginationControls.style.display = 'flex';
    
    const start = (routedPagination.page - 1) * routedPagination.limit + 1;
    const end = Math.min(routedPagination.page * routedPagination.limit, routedPagination.totalRecords);
    
    if (routedPageStartDisplay) routedPageStartDisplay.textContent = routedPagination.totalRecords > 0 ? start : 0;
    if (routedPageEndDisplay) routedPageEndDisplay.textContent = end;
    if (routedTotalRecordsDisplay) routedTotalRecordsDisplay.textContent = routedPagination.totalRecords;
    
    if (routedCurrentPageDisplay) routedCurrentPageDisplay.textContent = `Page ${routedPagination.page}`;
    
    if (routedPrevPageBtn) routedPrevPageBtn.disabled = routedPagination.page <= 1;
    if (routedNextPageBtn) routedNextPageBtn.disabled = routedPagination.page >= routedPagination.totalPages;
}
