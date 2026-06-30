import db from '../config/Database.js';
import { Employee } from '../models/Employee.js';
import { DatabaseError } from '../errors/AppErrors.js';

export class EmployeeRepository {
  async getById(id) {
    try {
      const row = await db.get('SELECT * FROM employees WHERE id = ?', [id]);
      return Employee.fromDatabaseRow(row);
    } catch (err) {
      throw new DatabaseError(`Failed to fetch employee by ID: ${err.message}`);
    }
  }

  async getByEmail(email) {
    try {
      const row = await db.get('SELECT * FROM employees WHERE email = ?', [email?.trim()?.toLowerCase()]);
      return Employee.fromDatabaseRow(row);
    } catch (err) {
      throw new DatabaseError(`Failed to fetch employee by email: ${err.message}`);
    }
  }

  async getAll({ search = '', departmentId = null, status = '', sortBy = 'last_name', sortOrder = 'ASC', limit = 10, offset = 0 } = {}) {
    try {
      let query = `
        SELECT e.*, d.name as department_name 
        FROM employees e
        JOIN departments d ON e.department_id = d.id
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        // Optimizing: matching first_name + ' ' + last_name, email, or role
        query += ` AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ? OR e.role LIKE ?)`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      if (departmentId) {
        query += ` AND e.department_id = ?`;
        params.push(parseInt(departmentId, 10));
      }

      if (status) {
        query += ` AND e.status = ?`;
        params.push(status);
      }

      // Count query for pagination
      const countQuery = `SELECT COUNT(*) as count FROM (${query})`;
      const countResult = await db.get(countQuery, params);
      const totalCount = countResult ? countResult.count : 0;

      // Sorting (Whitelist to avoid SQL injection)
      const allowedSortColumns = ['first_name', 'last_name', 'hire_date', 'salary', 'status', 'role'];
      const actualSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'last_name';
      const actualSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      query += ` ORDER BY e.${actualSortBy} ${actualSortOrder}`;
      query += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const rows = await db.all(query, params);
      const employees = rows.map(row => {
        const emp = Employee.fromDatabaseRow(row);
        emp.department_name = row.department_name; // Attach joined name
        return emp;
      });

      return { employees, totalCount };
    } catch (err) {
      throw new DatabaseError(`Failed to fetch employees list: ${err.message}`);
    }
  }

  async create(employee) {
    try {
      const sql = `
        INSERT INTO employees (first_name, last_name, email, phone, role, department_id, hire_date, salary, status, bio, profile_image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await db.run(sql, [
        employee.first_name,
        employee.last_name,
        employee.email,
        employee.phone,
        employee.role,
        employee.department_id,
        employee.hire_date,
        employee.salary,
        employee.status,
        employee.bio,
        employee.profile_image
      ]);
      employee.id = result.id;
      return employee;
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed: employees.email')) {
        throw new Error('UNIQUE_EMAIL_CONFLICT');
      }
      throw new DatabaseError(`Failed to save employee record: ${err.message}`);
    }
  }

  async update(employee) {
    try {
      const sql = `
        UPDATE employees 
        SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?, department_id = ?, hire_date = ?, salary = ?, status = ?, bio = ?, profile_image = ?
        WHERE id = ?
      `;
      const result = await db.run(sql, [
        employee.first_name,
        employee.last_name,
        employee.email,
        employee.phone,
        employee.role,
        employee.department_id,
        employee.hire_date,
        employee.salary,
        employee.status,
        employee.bio,
        employee.profile_image,
        employee.id
      ]);
      return result.changes > 0;
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed: employees.email')) {
        throw new Error('UNIQUE_EMAIL_CONFLICT');
      }
      throw new DatabaseError(`Failed to update employee record: ${err.message}`);
    }
  }

  async delete(id) {
    try {
      const result = await db.run('DELETE FROM employees WHERE id = ?', [id]);
      return result.changes > 0;
    } catch (err) {
      if (err.message.includes('FOREIGN KEY constraint failed')) {
        throw new Error('FOREIGN_KEY_CONFLICT');
      }
      throw new DatabaseError(`Failed to delete employee record: ${err.message}`);
    }
  }

  // Get department distribution stats for SVG charts
  async getDepartmentStats() {
    try {
      const query = `
        SELECT d.name as name, COUNT(e.id) as value, SUM(e.salary) as payroll
        FROM departments d
        LEFT JOIN employees e ON e.department_id = d.id AND e.status != 'Terminated'
        GROUP BY d.id
      `;
      return await db.all(query);
    } catch (err) {
      throw new DatabaseError(`Failed to calculate department statistics: ${err.message}`);
    }
  }

  // Get general statistics for dashboard widgets
  async getGeneralStats() {
    try {
      const total = await db.get('SELECT COUNT(*) as count FROM employees');
      const active = await db.get("SELECT COUNT(*) as count FROM employees WHERE status = 'Active'");
      const leave = await db.get("SELECT COUNT(*) as count FROM employees WHERE status = 'On Leave'");
      const avgSalary = await db.get("SELECT AVG(salary) as avg FROM employees WHERE status != 'Terminated'");
      
      return {
        total: total ? total.count : 0,
        active: active ? active.count : 0,
        onLeave: leave ? leave.count : 0,
        avgSalary: avgSalary && avgSalary.avg ? Math.round(avgSalary.avg) : 0
      };
    } catch (err) {
      throw new DatabaseError(`Failed to calculate dashboard statistics: ${err.message}`);
    }
  }
}
