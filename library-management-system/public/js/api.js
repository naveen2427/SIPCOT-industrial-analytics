const API_BASE = '/api';

class ApiService {
  async _request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    options.headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      
      if (!response.ok) {
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

  // Dashboard stats
  async getDashboardStats() {
    return this._request('/dashboard/stats');
  }

  // Books catalog CRUD
  async getBooks(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return this._request(`/books?${query.toString()}`);
  }

  async getBookById(id) {
    return this._request(`/books/${id}`);
  }

  async createBook(data) {
    return this._request('/books', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateBook(id, data) {
    return this._request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteBook(id) {
    return this._request(`/books/${id}`, {
      method: 'DELETE'
    });
  }

  // Members Registry CRUD
  async getMembers(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return this._request(`/members?${query.toString()}`);
  }

  async getMemberById(id) {
    return this._request(`/members/${id}`);
  }

  async createMember(data) {
    return this._request('/members', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateMember(id, data) {
    return this._request(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteMember(id) {
    return this._request(`/members/${id}`, {
      method: 'DELETE'
    });
  }

  async getMemberLogs(id) {
    return this._request(`/members/${id}/logs`);
  }

  // Loans transactions CRUD
  async getLoans(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    return this._request(`/loans?${query.toString()}`);
  }

  async checkoutBook(data) {
    return this._request('/loans', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async returnBook(id) {
    return this._request(`/loans/${id}/return`, {
      method: 'POST'
    });
  }
}

window.api = new ApiService();
