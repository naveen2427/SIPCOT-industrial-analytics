// State coordinator
const state = {
  currentView: 'dashboard',
  genres: [],
  booksFilter: { search: '', genre: '', availableOnly: '', sortBy: 'title', limit: 5, offset: 0 },
  membersFilter: { search: '', status: '', limit: 5, offset: 0 },
  loansFilter: { search: '', activeOnly: '', limit: 5, offset: 0 },
  debounceTimer: null
};

// View switching
window.switchView = function(viewName) {
  state.currentView = viewName;
  
  // Navigation active tabs
  ['dashboard', 'books', 'members', 'loans'].forEach(v => {
    document.getElementById(`nav-${v}`).classList.toggle('active', v === viewName);
    document.getElementById(`view-${v}`).style.display = v === viewName ? (v === 'dashboard' ? 'flex' : 'block') : 'none';
  });

  document.getElementById('view-title').textContent = 
    viewName === 'dashboard' ? 'Dashboard Overview' : 
    (viewName === 'books' ? 'Book Catalog' : 
    (viewName === 'members' ? 'Members Registry' : 'Loans & Returns'));

  closeDrawer();

  if (viewName === 'dashboard') loadDashboardData();
  else if (viewName === 'books') loadBooks();
  else if (viewName === 'members') loadMembers();
  else if (viewName === 'loans') loadLoans();
};

window.filterByGenre = function(genreName) {
  state.booksFilter.genre = genreName;
  document.getElementById('filter-genre').value = genreName;
  window.switchView('books');
};

// Dashboard
async function loadDashboardData() {
  try {
    const res = await window.api.getDashboardStats();
    if (res.success) {
      const { general, genres } = res.data;
      document.getElementById('stat-total-books').textContent = general.totalBooks;
      document.getElementById('stat-checked-out').textContent = general.checkedOut;
      document.getElementById('stat-overdue').textContent = general.overdueCount;
      document.getElementById('stat-total-members').textContent = general.totalMembers;

      window.components.renderGenreSVGChart('svg-chart-container', genres);
      window.components.renderGenreBreakdownList('genre-list-container', genres);
    }
  } catch (err) {
    console.error('Failed to load dashboard statistics:', err);
  }
}

// 1. Books Catalog
async function loadBooks() {
  try {
    const res = await window.api.getBooks(state.booksFilter);
    if (res.success) {
      const tbody = document.getElementById('books-table-body');
      tbody.innerHTML = '';
      
      if (res.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:32px;">No matching books in catalog.</td></tr>`;
      } else {
        res.data.forEach(book => {
          const row = window.components.renderBookRow(book, openEditBookModal, deleteBook);
          tbody.appendChild(row);
        });
      }
      updateBooksPagination(res.total);
    }
  } catch (err) {
    console.error('Failed to load books catalog:', err);
  }
}

window.handleBookSearch = function(event) {
  clearTimeout(state.debounceTimer);
  state.debounceTimer = setTimeout(() => {
    state.booksFilter.search = event.target.value;
    state.booksFilter.offset = 0;
    loadBooks();
  }, 300);
};

window.applyBookFilters = function() {
  state.booksFilter.genre = document.getElementById('filter-genre').value;
  state.booksFilter.availableOnly = document.getElementById('filter-availability').value;
  state.booksFilter.sortBy = document.getElementById('sort-books').value;
  state.booksFilter.offset = 0;
  loadBooks();
};

window.resetBookFilters = function() {
  state.booksFilter = { search: '', genre: '', availableOnly: '', sortBy: 'title', limit: 5, offset: 0 };
  document.getElementById('search-books').value = '';
  document.getElementById('filter-genre').value = '';
  document.getElementById('filter-availability').value = '';
  document.getElementById('sort-books').value = 'title';
  loadBooks();
};

window.changeBookPage = function(dir) {
  state.booksFilter.offset = Math.max(0, state.booksFilter.offset + dir * state.booksFilter.limit);
  loadBooks();
};

function updateBooksPagination(total) {
  const limit = state.booksFilter.limit;
  const offset = state.booksFilter.offset;
  const start = total === 0 ? 0 : offset + 1;
  const end = Math.min(offset + limit, total);
  
  document.getElementById('books-pagination-text').textContent = `Showing ${start} to ${end} of ${total} books`;
  document.getElementById('btn-books-prev').disabled = offset === 0;
  document.getElementById('btn-books-next').disabled = offset + limit >= total;
}

// 2. Members Registry
async function loadMembers() {
  try {
    const res = await window.api.getMembers(state.membersFilter);
    if (res.success) {
      const tbody = document.getElementById('members-table-body');
      tbody.innerHTML = '';
      
      if (res.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--text-muted); padding:32px;">No registered members found.</td></tr>`;
      } else {
        res.data.forEach(m => {
          const row = window.components.renderMemberRow(m, openDrawer, openEditMemberModal, deleteMember);
          tbody.appendChild(row);
        });
      }
      updateMembersPagination(res.total);
    }
  } catch (err) {
    console.error('Failed to load members:', err);
  }
}

window.handleMemberSearch = function(event) {
  clearTimeout(state.debounceTimer);
  state.debounceTimer = setTimeout(() => {
    state.membersFilter.search = event.target.value;
    state.membersFilter.offset = 0;
    loadMembers();
  }, 300);
};

window.applyMemberFilters = function() {
  state.membersFilter.status = document.getElementById('filter-member-status').value;
  state.membersFilter.offset = 0;
  loadMembers();
};

window.resetMemberFilters = function() {
  state.membersFilter = { search: '', status: '', limit: 5, offset: 0 };
  document.getElementById('search-members').value = '';
  document.getElementById('filter-member-status').value = '';
  loadMembers();
};

window.changeMemberPage = function(dir) {
  state.membersFilter.offset = Math.max(0, state.membersFilter.offset + dir * state.membersFilter.limit);
  loadMembers();
};

function updateMembersPagination(total) {
  const limit = state.membersFilter.limit;
  const offset = state.membersFilter.offset;
  const start = total === 0 ? 0 : offset + 1;
  const end = Math.min(offset + limit, total);
  
  document.getElementById('members-pagination-text').textContent = `Showing ${start} to ${end} of ${total} members`;
  document.getElementById('btn-members-prev').disabled = offset === 0;
  document.getElementById('btn-members-next').disabled = offset + limit >= total;
}

// 3. Loans log
async function loadLoans() {
  try {
    const res = await window.api.getLoans(state.loansFilter);
    if (res.success) {
      const tbody = document.getElementById('loans-table-body');
      tbody.innerHTML = '';
      
      if (res.data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:32px;">No checkout transaction history.</td></tr>`;
      } else {
        res.data.forEach(loan => {
          const row = window.components.renderLoanRow(loan, returnBook);
          tbody.appendChild(row);
        });
      }
      updateLoansPagination(res.total);
    }
  } catch (err) {
    console.error('Failed to load loans log:', err);
  }
}

window.handleLoanSearch = function(event) {
  clearTimeout(state.debounceTimer);
  state.debounceTimer = setTimeout(() => {
    state.loansFilter.search = event.target.value;
    state.loansFilter.offset = 0;
    loadLoans();
  }, 300);
};

window.applyLoanFilters = function() {
  state.loansFilter.activeOnly = document.getElementById('filter-loan-status').value;
  state.loansFilter.offset = 0;
  loadLoans();
};

window.resetLoanFilters = function() {
  state.loansFilter = { search: '', activeOnly: '', limit: 5, offset: 0 };
  document.getElementById('search-loans').value = '';
  document.getElementById('filter-loan-status').value = '';
  loadLoans();
};

window.changeLoanPage = function(dir) {
  state.loansFilter.offset = Math.max(0, state.loansFilter.offset + dir * state.loansFilter.limit);
  loadLoans();
};

function updateLoansPagination(total) {
  const limit = state.loansFilter.limit;
  const offset = state.loansFilter.offset;
  const start = total === 0 ? 0 : offset + 1;
  const end = Math.min(offset + limit, total);
  
  document.getElementById('loans-pagination-text').textContent = `Showing ${start} to ${end} of ${total} logs`;
  document.getElementById('btn-loans-prev').disabled = offset === 0;
  document.getElementById('btn-loans-next').disabled = offset + limit >= total;
}

// 4. Modals - Book CRUD
window.openBookModal = function() {
  resetErrors();
  document.getElementById('book-form').reset();
  document.getElementById('form-book-id').value = '';
  document.getElementById('book-modal-title').textContent = 'Add New Book to Catalog';
  document.getElementById('btn-save-book').textContent = 'Add Book';
  document.getElementById('inp-book-year').value = new Date().getFullYear();
  document.getElementById('book-modal').classList.add('open');
};

async function openEditBookModal(id) {
  resetErrors();
  try {
    const res = await window.api.getBookById(id);
    if (res.success) {
      const book = res.data;
      document.getElementById('form-book-id').value = book.id;
      document.getElementById('inp-book-title').value = book.title;
      document.getElementById('inp-book-author').value = book.author;
      document.getElementById('inp-book-isbn').value = book.isbn;
      document.getElementById('inp-book-genre').value = book.genre;
      document.getElementById('inp-book-year').value = book.published_year;
      document.getElementById('inp-book-copies').value = book.total_copies;
      document.getElementById('inp-book-shelf').value = book.shelf_location;
      
      document.getElementById('book-modal-title').textContent = 'Update Book Details';
      document.getElementById('btn-save-book').textContent = 'Save Updates';
      document.getElementById('book-modal').classList.add('open');
    }
  } catch (err) {
    alert(`Failed to retrieve book details: ${err.message}`);
  }
}

window.closeBookModal = function() {
  document.getElementById('book-modal').classList.remove('open');
};

window.handleBookSubmit = async function(event) {
  event.preventDefault();
  resetErrors();
  const id = document.getElementById('form-book-id').value;
  const payload = {
    title: document.getElementById('inp-book-title').value,
    author: document.getElementById('inp-book-author').value,
    isbn: document.getElementById('inp-book-isbn').value,
    genre: document.getElementById('inp-book-genre').value,
    published_year: document.getElementById('inp-book-year').value,
    total_copies: document.getElementById('inp-book-copies').value,
    shelf_location: document.getElementById('inp-book-shelf').value
  };

  try {
    const res = id ? await window.api.updateBook(id, payload) : await window.api.createBook(payload);
    if (res.success) {
      closeBookModal();
      if (state.currentView === 'dashboard') loadDashboardData();
      else if (state.currentView === 'books') loadBooks();
    }
  } catch (err) {
    if (err.errors) displayErrors(err.errors);
    else alert(`Action aborted: ${err.message}`);
  }
};

async function deleteBook(id) {
  if (confirm('Are you sure you want to delete this book from catalog?')) {
    try {
      const res = await window.api.deleteBook(id);
      if (res.success) loadBooks();
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  }
}

// 5. Modals - Member Registry
window.openMemberModal = function() {
  resetErrors();
  document.getElementById('member-form').reset();
  document.getElementById('form-member-id').value = '';
  document.getElementById('member-modal-title').textContent = 'Register New Member';
  document.getElementById('btn-save-member').textContent = 'Register Member';
  document.getElementById('member-modal').classList.add('open');
};

async function openEditMemberModal(id) {
  resetErrors();
  try {
    const res = await window.api.getMemberById(id);
    if (res.success) {
      const m = res.data;
      document.getElementById('form-member-id').value = m.id;
      document.getElementById('inp-member-firstname').value = m.first_name;
      document.getElementById('inp-member-lastname').value = m.last_name;
      document.getElementById('inp-member-email').value = m.email;
      document.getElementById('inp-member-phone').value = m.phone;
      document.getElementById('inp-member-status').value = m.status;

      document.getElementById('member-modal-title').textContent = 'Update Member Registry Card';
      document.getElementById('btn-save-member').textContent = 'Save Updates';
      document.getElementById('member-modal').classList.add('open');
    }
  } catch (err) {
    alert(`Failed to fetch member details: ${err.message}`);
  }
}

window.closeMemberModal = function() {
  document.getElementById('member-modal').classList.remove('open');
};

window.handleMemberSubmit = async function(event) {
  event.preventDefault();
  resetErrors();
  const id = document.getElementById('form-member-id').value;
  const payload = {
    first_name: document.getElementById('inp-member-firstname').value,
    last_name: document.getElementById('inp-member-lastname').value,
    email: document.getElementById('inp-member-email').value,
    phone: document.getElementById('inp-member-phone').value,
    status: document.getElementById('inp-member-status').value,
    joined_date: id ? undefined : new Date().toISOString().split('T')[0] // only set joined on registration
  };

  try {
    const res = id ? await window.api.updateMember(id, payload) : await window.api.createMember(payload);
    if (res.success) {
      closeMemberModal();
      if (state.currentView === 'dashboard') loadDashboardData();
      else if (state.currentView === 'members') loadMembers();
    }
  } catch (err) {
    if (err.errors) displayErrors(err.errors);
    else alert(`Action aborted: ${err.message}`);
  }
};

async function deleteMember(id) {
  if (confirm('Are you sure you want to delete this member registry card?')) {
    try {
      const res = await window.api.deleteMember(id);
      if (res.success) loadMembers();
    } catch (err) {
      alert(`Deletion aborted: ${err.message}`);
    }
  }
}

// 6. Borrow / Issue Transactions
window.openBorrowModal = async function() {
  resetErrors();
  document.getElementById('borrow-form').reset();
  
  const bookSelect = document.getElementById('inp-borrow-book');
  const memberSelect = document.getElementById('inp-borrow-member');
  
  bookSelect.innerHTML = '<option value="">Loading catalog books...</option>';
  memberSelect.innerHTML = '<option value="">Loading members registry...</option>';
  
  document.getElementById('borrow-modal').classList.add('open');

  try {
    const [booksRes, membersRes] = await Promise.all([
      window.api.getBooks({ availableOnly: 'true', limit: 100 }),
      window.api.getMembers({ status: 'Active', limit: 100 })
    ]);

    if (booksRes.success && membersRes.success) {
      bookSelect.innerHTML = '<option value="">Select Book to Checkout *</option>';
      booksRes.data.forEach(book => {
        bookSelect.innerHTML += `<option value="${book.id}">${book.title} (by ${book.author}) [Shelf: ${book.shelf_location}]</option>`;
      });

      memberSelect.innerHTML = '<option value="">Select Member/Borrower *</option>';
      membersRes.data.forEach(m => {
        memberSelect.innerHTML += `<option value="${m.id}">${m.fullName} (${m.email})</option>`;
      });
    }
  } catch (err) {
    bookSelect.innerHTML = '<option value="">Failed to load list</option>';
    memberSelect.innerHTML = '<option value="">Failed to load list</option>';
  }
};

window.closeBorrowModal = function() {
  document.getElementById('borrow-modal').classList.remove('open');
};

window.handleBorrowSubmit = async function(event) {
  event.preventDefault();
  resetErrors();
  
  const payload = {
    book_id: document.getElementById('inp-borrow-book').value,
    member_id: document.getElementById('inp-borrow-member').value,
    borrow_days: document.getElementById('inp-borrow-days').value
  };

  try {
    const res = await window.api.checkoutBook(payload);
    if (res.success) {
      closeBorrowModal();
      if (state.currentView === 'dashboard') loadDashboardData();
      else if (state.currentView === 'loans') loadLoans();
    }
  } catch (err) {
    if (err.errors) displayErrors(err.errors);
    else alert(`Checkout failed: ${err.message}`);
  }
};

async function returnBook(id) {
  if (confirm('Confirm return of this book copy? Fines will be calculated if late.')) {
    try {
      const res = await window.api.returnBook(id);
      if (res.success) {
        alert(res.message);
        if (state.currentView === 'dashboard') loadDashboardData();
        else if (state.currentView === 'loans') loadLoans();
      }
    } catch (err) {
      alert(`Return rejected: ${err.message}`);
    }
  }
}

// 7. Member Inspector Drawer
async function openDrawer(id) {
  const drawer = document.getElementById('member-drawer');
  const container = document.getElementById('drawer-content');
  container.innerHTML = '<div style="color:var(--text-muted); text-align:center; padding:40px;">Reading library card files...</div>';
  drawer.classList.add('open');

  try {
    const [mRes, logsRes] = await Promise.all([
      window.api.getMemberById(id),
      window.api.getMemberLogs(id)
    ]);

    if (mRes.success && logsRes.success) {
      container.innerHTML = window.components.renderMemberDrawerContent(mRes.data, logsRes.data);
    }
  } catch (err) {
    container.innerHTML = `<div style="color:var(--danger); padding:20px;">Inspection failed: ${err.message}</div>`;
  }
}

window.closeDrawer = function() {
  document.getElementById('member-drawer').classList.remove('open');
};

// Form errors helpers
function displayErrors(errors) {
  Object.entries(errors).forEach(([field, msg]) => {
    const group = document.getElementById(`group-${field}`);
    if (group) {
      group.classList.add('has-error');
      const msgDiv = group.querySelector('.form-error-msg');
      if (msgDiv) msgDiv.textContent = msg;
    }
  });
}

function resetErrors() {
  document.querySelectorAll('.form-group').forEach(g => {
    g.classList.remove('has-error');
    const msg = g.querySelector('.form-error-msg');
    if (msg) msg.textContent = '';
  });
}

// Global actions mapping
window.appControllers = {
  editBook: openEditBookModal,
  deleteBook: deleteBook,
  editMember: openEditMemberModal,
  deleteMember: deleteMember,
  returnBook: returnBook
};

// Populate initial catalog genres options
async function loadGenresDropdown() {
  try {
    const res = await window.api.getDashboardStats();
    if (res.success) {
      const select = document.getElementById('filter-genre');
      const selected = select.value;
      select.innerHTML = '<option value="">All Genres</option>';
      res.data.genres.forEach(g => {
        select.innerHTML += `<option value="${g.name}">${g.name}</option>`;
      });
      select.value = selected;
    }
  } catch (err) {
    console.error('Failed to load genres filters:', err);
  }
}

// Authentication Flow
window.handleLoginSubmit = function(event) {
  event.preventDefault();
  
  // Reset errors
  document.getElementById('login-group-email').classList.remove('has-error');
  document.getElementById('login-err-email').textContent = '';
  document.getElementById('login-group-password').classList.remove('has-error');
  document.getElementById('login-err-password').textContent = '';

  const email = document.getElementById('inp-login-email').value.trim();
  const password = document.getElementById('inp-login-password').value.trim();

  let hasError = false;

  if (!email) {
    document.getElementById('login-group-email').classList.add('has-error');
    document.getElementById('login-err-email').textContent = 'Librarian email is required.';
    hasError = true;
  }
  
  if (!password) {
    document.getElementById('login-group-password').classList.add('has-error');
    document.getElementById('login-err-password').textContent = 'Librarian password is required.';
    hasError = true;
  }

  if (hasError) return;

  if (email === 'librarian@granth.in' && password === 'granth_admin') {
    sessionStorage.setItem('granth_session', 'active');
    showApplication();
  } else {
    if (email !== 'librarian@granth.in') {
      document.getElementById('login-group-email').classList.add('has-error');
      document.getElementById('login-err-email').textContent = 'Librarian email not registered.';
    } else {
      document.getElementById('login-group-password').classList.add('has-error');
      document.getElementById('login-err-password').textContent = 'Invalid administrator password.';
    }
  }
};

window.handleLogout = function(event) {
  if (event) event.preventDefault();
  sessionStorage.removeItem('granth_session');
  showLogin();
};

function showLogin() {
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('login-form').reset();
}

async function showApplication() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('main-app').style.display = 'flex';
  
  // Boot data
  await loadDashboardData();
  await loadGenresDropdown();
}

// Boot Check
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('granth_session') === 'active') {
    showApplication();
  } else {
    showLogin();
  }
});
