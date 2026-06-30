import { ValidationError } from '../errors/AppErrors.js';

export class Member {
  constructor({ id = null, first_name, last_name, email, phone, joined_date, status = 'Active' }) {
    this.id = id;
    this.first_name = first_name?.trim();
    this.last_name = last_name?.trim();
    this.email = email?.trim()?.toLowerCase();
    this.phone = phone?.trim();
    this.joined_date = joined_date;
    this.status = status;
  }

  get fullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  get membershipTenureInMonths() {
    const joined = new Date(this.joined_date);
    const now = new Date();
    const yearsDiff = now.getFullYear() - joined.getFullYear();
    const monthsDiff = now.getMonth() - joined.getMonth();
    return Math.max(0, (yearsDiff * 12) + monthsDiff);
  }

  validate() {
    const errors = {};

    if (!this.first_name) errors.first_name = 'First name is required.';
    else if (this.first_name.length < 2) errors.first_name = 'First name must be at least 2 characters.';

    if (!this.last_name) errors.last_name = 'Last name is required.';
    else if (this.last_name.length < 2) errors.last_name = 'Last name must be at least 2 characters.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email) errors.email = 'Email address is required.';
    else if (!emailRegex.test(this.email)) errors.email = 'Invalid email address structure.';

    const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
    if (!this.phone) errors.phone = 'Phone number is required.';
    else if (!phoneRegex.test(this.phone)) errors.phone = 'Invalid phone number format.';

    if (!this.joined_date) {
      errors.joined_date = 'Joined date is required.';
    } else {
      const date = new Date(this.joined_date);
      if (isNaN(date.getTime())) errors.joined_date = 'Invalid date format.';
    }

    const validStatuses = ['Active', 'Suspended', 'Inactive'];
    if (!validStatuses.includes(this.status)) {
      errors.status = 'Invalid status selected.';
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed for Member registry details.', errors);
    }
  }

  static fromDatabaseRow(row) {
    if (!row) return null;
    return new Member({
      id: row.id,
      first_name: row.first_name,
      last_name: row.last_name,
      email: row.email,
      phone: row.phone,
      joined_date: row.joined_date,
      status: row.status
    });
  }
}
