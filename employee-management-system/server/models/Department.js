import { ValidationError } from '../errors/AppErrors.js';

export class Department {
  constructor({ id = null, name, description = '', manager_id = null, manager_name = null }) {
    this.id = id;
    this.name = name?.trim();
    this.description = description?.trim() || '';
    this.manager_id = manager_id ? parseInt(manager_id, 10) : null;
    this.manager_name = manager_name; // Join helper
  }

  validate() {
    const errors = {};
    if (!this.name) {
      errors.name = 'Department name is required.';
    } else if (this.name.length < 3) {
      errors.name = 'Department name must be at least 3 characters.';
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed for department details.', errors);
    }
  }

  static fromDatabaseRow(row) {
    if (!row) return null;
    return new Department({
      id: row.id,
      name: row.name,
      description: row.description,
      manager_id: row.manager_id,
      manager_name: row.manager_name || null
    });
  }
}
