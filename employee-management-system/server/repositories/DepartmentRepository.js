import db from '../config/Database.js';
import { Department } from '../models/Department.js';
import { DatabaseError } from '../errors/AppErrors.js';

export class DepartmentRepository {
  async getAll() {
    try {
      const sql = `
        SELECT d.*, (e.first_name || ' ' || e.last_name) as manager_name 
        FROM departments d
        LEFT JOIN employees e ON d.manager_id = e.id
      `;
      const rows = await db.all(sql);
      return rows.map(row => Department.fromDatabaseRow(row));
    } catch (err) {
      throw new DatabaseError(`Failed to fetch departments: ${err.message}`);
    }
  }

  async getById(id) {
    try {
      const sql = `
        SELECT d.*, (e.first_name || ' ' || e.last_name) as manager_name 
        FROM departments d
        LEFT JOIN employees e ON d.manager_id = e.id
        WHERE d.id = ?
      `;
      const row = await db.get(sql, [id]);
      return Department.fromDatabaseRow(row);
    } catch (err) {
      throw new DatabaseError(`Failed to fetch department by ID: ${err.message}`);
    }
  }

  async updateManager(departmentId, managerId) {
    try {
      const sql = 'UPDATE departments SET manager_id = ? WHERE id = ?';
      const result = await db.run(sql, [managerId, departmentId]);
      return result.changes > 0;
    } catch (err) {
      throw new DatabaseError(`Failed to update department manager: ${err.message}`);
    }
  }
}
