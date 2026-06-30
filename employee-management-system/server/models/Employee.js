import { ValidationError } from '../errors/AppErrors.js';

export class Employee {
  constructor({
    id = null,
    first_name,
    last_name,
    email,
    phone,
    role,
    department_id,
    hire_date,
    salary,
    status = 'Active',
    bio = '',
    profile_image = ''
  }) {
    this.id = id;
    this.first_name = first_name?.trim();
    this.last_name = last_name?.trim();
    this.email = email?.trim()?.toLowerCase();
    this.phone = phone?.trim();
    this.role = role?.trim();
    this.department_id = parseInt(department_id, 10);
    this.hire_date = hire_date; // Format YYYY-MM-DD
    this.salary = parseFloat(salary);
    this.status = status;
    this.bio = bio?.trim() || '';
    this.profile_image = profile_image?.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'; // Default avatar
  }

  get fullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  get tenureInMonths() {
    const hire = new Date(this.hire_date);
    const now = new Date();
    const yearsDiff = now.getFullYear() - hire.getFullYear();
    const monthsDiff = now.getMonth() - hire.getMonth();
    return Math.max(0, (yearsDiff * 12) + monthsDiff);
  }

  get taxBracket() {
    // Indian Income Tax slabs under the New Tax Regime (Simplistic version)
    if (this.salary <= 300000) return 'Exempt (0%)';
    if (this.salary <= 700000) return '5% (Tax Slab)';
    if (this.salary <= 1000000) return '10%';
    if (this.salary <= 1200000) return '15%';
    if (this.salary <= 1500000) return '20%';
    return '30%';
  }

  get benefitsEligibility() {
    if (this.status !== 'Active') {
      return 'None (Inactive/Suspended)';
    }
    if (this.salary >= 1500000) {
      return 'Premium Family Health Insurance + EPF + HRA + Car Lease Option + Gratuity';
    }
    if (this.salary >= 700000) {
      return 'Standard Corporate Health Insurance + EPF + HRA + Gratuity';
    }
    return 'Basic Health Insurance + EPF + Gratuity';
  }

  validate() {
    const errors = {};

    if (!this.first_name) errors.first_name = 'First name is required.';
    else if (this.first_name.length < 2) errors.first_name = 'First name must be at least 2 characters.';

    if (!this.last_name) errors.last_name = 'Last name is required.';
    else if (this.last_name.length < 2) errors.last_name = 'Last name must be at least 2 characters.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) errors.email = 'Email is required.';
    else if (!emailRegex.test(this.email)) errors.email = 'Invalid email address.';

    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    if (!this.phone) errors.phone = 'Phone number is required.';
    else if (!phoneRegex.test(this.phone)) errors.phone = 'Invalid phone number format.';

    if (!this.role) errors.role = 'Role is required.';

    if (isNaN(this.department_id) || this.department_id <= 0) {
      errors.department_id = 'Valid department must be selected.';
    }

    if (!this.hire_date) {
      errors.hire_date = 'Hire date is required.';
    } else {
      const date = new Date(this.hire_date);
      if (isNaN(date.getTime())) {
        errors.hire_date = 'Invalid date format.';
      } else if (date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
        errors.hire_date = 'Hire date cannot be more than 30 days in the future.';
      }
    }

    if (isNaN(this.salary) || this.salary <= 0) {
      errors.salary = 'Salary must be a positive number.';
    }

    const validStatuses = ['Active', 'Inactive', 'On Leave', 'Terminated'];
    if (!validStatuses.includes(this.status)) {
      errors.status = 'Invalid status selected.';
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed for employee details.', errors);
    }
  }

  // Converts DB model row to Employee object
  static fromDatabaseRow(row) {
    if (!row) return null;
    return new Employee({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      department_id: row.department_id,
      hire_date: row.hire_date,
      salary: row.salary,
      status: row.status,
      bio: row.bio,
      profile_image: row.profile_image
    });
  }
}
