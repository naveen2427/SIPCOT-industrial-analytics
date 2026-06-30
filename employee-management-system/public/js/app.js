// App Coordinator & Routing Module

// State Management
const state = {
  currentView: 'dashboard',
  departments: [],
  filters: {
    search: '',
    departmentId: '',
    status: '',
    sortBy: 'last_name',
    sortOrder: 'ASC',
    limit: 5, // 5 per page to demonstrate pagination
    offset: 0
  },
  totalCount: 0,
  debounceTimer: null
};

// Switch Views
window.switchView = function(viewName) {
  state.currentView = viewName;
  
  // Update nav UI active class
  document.getElementById('nav-dashboard').classList.toggle('active', viewName === 'dashboard');
  document.getElementById('nav-directory').classList.toggle('active', viewName === 'directory');
  
  // Toggle content divs
  document.getElementById('view-dashboard').style.display = viewName === 'dashboard' ? 'flex' : 'none';
  document.getElementById('view-directory').style.display = viewName === 'directory' ? 'block' : 'none';
  
  // Title update
  document.getElementById('view-title').textContent = viewName === 'dashboard' ? 'Dashboard Overview' : 'Employee Directory';
  
  // Load data based on view
  if (viewName === 'dashboard') {
    loadDashboardData();
  } else {
    loadEmployees();
  }
  
  // Auto close drawer if open during switch
  closeDrawer();
};

// Filter Helpers
window.filterByDepartment = function(deptId) {
  state.filters.departmentId = deptId;
  document.getElementById('filter-department').value = deptId;
  window.switchView('directory');
};

// Load Dashboard Analytics
async function loadDashboardData() {
  try {
    const response = await window.api.getDashboardStats();
    if (response.success) {
      const { general, departments } = response.data;
      
      // Update general metrics widgets
      document.getElementById('stat-total').textContent = general.total;
      document.getElementById('stat-active').textContent = general.active;
      document.getElementById('stat-leave').textContent = general.onLeave;
      
      const payrollStr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(general.avgSalary);
      document.getElementById('stat-avg-salary').textContent = payrollStr;

      // Draw SVG chart and metadata lists
      window.components.renderDepartmentSVGChart('svg-chart-container', departments);
      window.components.renderDepartmentMetricsList('dept-list-container', departments);
    }
  } catch (err) {
    console.error('Failed to load dashboard metrics:', err);
  }
}

// Load Employees with Active Filters
async function loadEmployees() {
  try {
    const response = await window.api.getEmployees(state.filters);
    if (response.success) {
      state.totalCount = response.total;
      
      const tbody = document.getElementById('employees-table-body');
      tbody.innerHTML = '';
      
      if (response.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:32px;">No matching employees found.</td></tr>`;
      } else {
        response.data.forEach(employee => {
          const row = window.components.renderEmployeeRow(
            employee,
            openDrawer,
            openEditModal,
            deleteEmployee
          );
          tbody.appendChild(row);
        });
      }

      updatePaginationUI();
    }
  } catch (err) {
    console.error('Failed to load employees directory:', err);
  }
}

// Handle debounced search triggers to accelerate record lookups without database exhaustion
window.handleSearchInput = function(event) {
  clearTimeout(state.debounceTimer);
  state.debounceTimer = setTimeout(() => {
    state.filters.search = event.target.value;
    state.filters.offset = 0; // reset to page 1
    loadEmployees();
  }, 300);
};

// Apply dropdown and sorting filters
window.applyFilters = function() {
  state.filters.departmentId = document.getElementById('filter-department').value;
  state.filters.status = document.getElementById('filter-status').value;
  state.filters.sortBy = document.getElementById('sort-column').value;
  state.filters.offset = 0; // reset to page 1
  loadEmployees();
};

// Reset Filters
window.resetFilters = function() {
  state.filters.search = '';
  state.filters.departmentId = '';
  state.filters.status = '';
  state.filters.sortBy = 'last_name';
  state.filters.offset = 0;
  
  document.getElementById('search-input').value = '';
  document.getElementById('filter-department').value = '';
  document.getElementById('filter-status').value = '';
  document.getElementById('sort-column').value = 'last_name';
  
  loadEmployees();
};

// Pagination Logic
window.changePage = function(direction) {
  const currentOffset = state.filters.offset;
  const limit = state.filters.limit;
  
  let newOffset = currentOffset + direction * limit;
  if (newOffset < 0) newOffset = 0;
  if (newOffset >= state.totalCount && direction > 0) return; // boundary check
  
  state.filters.offset = newOffset;
  loadEmployees();
};

function updatePaginationUI() {
  const limit = state.filters.limit;
  const offset = state.filters.offset;
  
  const start = state.totalCount === 0 ? 0 : offset + 1;
  const end = Math.min(offset + limit, state.totalCount);
  
  document.getElementById('pagination-info-text').textContent = 
    `Showing ${start} to ${end} of ${state.totalCount} employees`;

  // Enable/disable buttons
  document.getElementById('btn-page-prev').disabled = offset === 0;
  document.getElementById('btn-page-prev').style.opacity = offset === 0 ? '0.5' : '1';
  
  const hasMore = offset + limit < state.totalCount;
  document.getElementById('btn-page-next').disabled = !hasMore;
  document.getElementById('btn-page-next').style.opacity = !hasMore ? '0.5' : '1';
}

// Fetch all departments to fill form dropdown select fields
async function loadDepartments() {
  try {
    const response = await window.api.getDepartments();
    if (response.success) {
      state.departments = response.data;
      
      // Populate Directory Department Filter Options
      const filterSelect = document.getElementById('filter-department');
      const savedFilterVal = filterSelect.value;
      filterSelect.innerHTML = '<option value="">All Departments</option>';
      state.departments.forEach(dept => {
        filterSelect.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
      });
      filterSelect.value = savedFilterVal;

      // Populate Form Department Options
      const formSelect = document.getElementById('inp-department');
      formSelect.innerHTML = '<option value="">Select Department *</option>';
      state.departments.forEach(dept => {
        formSelect.innerHTML += `<option value="${dept.id}">${dept.name}</option>`;
      });
    }
  } catch (err) {
    console.error('Failed to load departments lookup list:', err);
  }
}

// Open Onboard/Edit Modal
window.openOnboardModal = function() {
  resetFormErrors();
  document.getElementById('employee-form').reset();
  document.getElementById('form-employee-id').value = '';
  document.getElementById('modal-title-text').textContent = 'Onboard New Employee';
  document.getElementById('btn-save-employee').textContent = 'Onboard Employee';
  
  // default hire date to today
  document.getElementById('inp-hire-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('inp-status').value = 'Active';
  
  document.getElementById('employee-modal').classList.add('open');
};

async function openEditModal(id) {
  resetFormErrors();
  try {
    const response = await window.api.getEmployeeById(id);
    if (response.success) {
      const employee = response.data;
      
      document.getElementById('form-employee-id').value = employee.id;
      document.getElementById('inp-first-name').value = employee.first_name;
      document.getElementById('inp-last-name').value = employee.last_name;
      document.getElementById('inp-email').value = employee.email;
      document.getElementById('inp-phone').value = employee.phone;
      document.getElementById('inp-role').value = employee.role;
      document.getElementById('inp-department').value = employee.department_id;
      document.getElementById('inp-salary').value = employee.salary;
      document.getElementById('inp-hire-date').value = employee.hire_date;
      document.getElementById('inp-status').value = employee.status;
      document.getElementById('inp-avatar').value = employee.profile_image === 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' ? '' : employee.profile_image;
      document.getElementById('inp-bio').value = employee.bio;

      document.getElementById('modal-title-text').textContent = 'Update Employee Profile';
      document.getElementById('btn-save-employee').textContent = 'Save Updates';
      
      document.getElementById('employee-modal').classList.add('open');
    }
  } catch (err) {
    alert(`Failed to fetch employee details for editing: ${err.message}`);
  }
}

window.closeEmployeeModal = function() {
  document.getElementById('employee-modal').classList.remove('open');
};

// Form Validations & Submissions
window.handleFormSubmit = async function(event) {
  event.preventDefault();
  resetFormErrors();

  const id = document.getElementById('form-employee-id').value;
  const payload = {
    first_name: document.getElementById('inp-first-name').value,
    last_name: document.getElementById('inp-last-name').value,
    email: document.getElementById('inp-email').value,
    phone: document.getElementById('inp-phone').value,
    role: document.getElementById('inp-role').value,
    department_id: document.getElementById('inp-department').value,
    salary: document.getElementById('inp-salary').value,
    hire_date: document.getElementById('inp-hire-date').value,
    status: document.getElementById('inp-status').value,
    profile_image: document.getElementById('inp-avatar').value,
    bio: document.getElementById('inp-bio').value
  };

  try {
    let result;
    if (id) {
      // Edit mode
      result = await window.api.updateEmployee(id, payload);
    } else {
      // Create mode
      result = await window.api.createEmployee(payload);
    }

    if (result.success) {
      window.closeEmployeeModal();
      // Reload active data depending on view
      if (state.currentView === 'dashboard') {
        loadDashboardData();
      } else {
        loadEmployees();
      }
    }
  } catch (err) {
    if (err.errors) {
      // Map validations to fields
      displayFormErrors(err.errors);
    } else {
      alert(`Transaction failed: ${err.message}`);
    }
  }
};

function displayFormErrors(errors) {
  Object.entries(errors).forEach(([field, msg]) => {
    const group = document.getElementById(`group-${field}`);
    if (group) {
      group.classList.add('has-error');
      const errorMsgDiv = group.querySelector('.form-error-msg');
      if (errorMsgDiv) errorMsgDiv.textContent = msg;
    }
  });
}

function resetFormErrors() {
  const groups = document.querySelectorAll('.form-group');
  groups.forEach(g => {
    g.classList.remove('has-error');
    const msg = g.querySelector('.form-error-msg');
    if (msg) msg.textContent = '';
  });
}

// Delete Employee Action
async function deleteEmployee(id) {
  if (confirm('Are you sure you want to completely delete or archive this employee record? This action is tracked in compliance logs.')) {
    try {
      const response = await window.api.deleteEmployee(id);
      if (response.success) {
        if (state.currentView === 'dashboard') {
          loadDashboardData();
        } else {
          loadEmployees();
        }
        closeDrawer();
      }
    } catch (err) {
      alert(`Deletion aborted: ${err.message}`);
    }
  }
}

// Side Drawer Detail Inspection
async function openDrawer(id) {
  const drawer = document.getElementById('employee-drawer');
  const container = document.getElementById('drawer-content');
  container.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:40px;">Fetching records file...</div>';
  drawer.classList.add('open');

  try {
    // Parallel retrieval of employee full info & activity log audit trails
    const [empRes, logsRes] = await Promise.all([
      window.api.getEmployeeById(id),
      window.api.getEmployeeLogs(id)
    ]);

    if (empRes.success && logsRes.success) {
      // Map department name
      const employee = empRes.data;
      const matchingDept = state.departments.find(d => d.id === employee.department_id);
      employee.department_name = matchingDept ? matchingDept.name : 'Unknown';

      const drawerHtml = window.components.renderEmployeeDrawerContent(employee, logsRes.data);
      container.innerHTML = drawerHtml;
    }
  } catch (err) {
    container.innerHTML = `<div style="color:var(--danger); padding:20px;">Retrieval failed: ${err.message}</div>`;
  }
}

window.closeDrawer = function() {
  document.getElementById('employee-drawer').classList.remove('open');
};

// Global Exposure for actions mapping inside dynamically drawn components
window.appControllers = {
  editEmployee: openEditModal,
  deleteEmployee: deleteEmployee
};

// Init application
document.addEventListener('DOMContentLoaded', async () => {
  await loadDepartments();
  loadDashboardData();
});
