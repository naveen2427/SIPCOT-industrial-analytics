// API service communication module
const API_BASE = '/api';

class ApiService {
  async _request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    // Set headers
    options.headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      if (!response.ok) {
        // Build error object from server response
        const error = new Error(result.message || 'API request failed');
        error.status = response.ok;
        error.errors = result.errors || null;
        throw error;
      }
      
      return result;
    } catch (err) {
      console.error(`API Error on ${endpoint}:`, err);
      throw err;
    }
  }

  // Dashboard Stats
  async getDashboardStats() {
    return this._request('/dashboard/stats');
  }

  // Employees CRUD
  async getEmployees(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this._request(`/employees${queryString}`);
  }

  async getEmployeeById(id) {
    return this._request(`/employees/${id}`);
  }

  async createEmployee(data) {
    return this._request('/employees', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateEmployee(id, data) {
    return this._request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteEmployee(id) {
    return this._request(`/employees/${id}`, {
      method: 'DELETE'
    });
  }

  async getEmployeeLogs(id) {
    return this._request(`/employees/${id}/logs`);
  }

  // Departments List
  async getDepartments() {
    return this._request('/departments');
  }
}

window.api = new ApiService();
