import db from '../config/Database.js';
import { DatabaseError } from '../errors/AppErrors.js';

export class ActivityLogRepository {
  async log(employeeId, action, details) {
    try {
      const timestamp = new Date().toISOString();
      const sql = 'INSERT INTO activity_logs (employee_id, action, timestamp, details) VALUES (?, ?, ?, ?)';
      await db.run(sql, [employeeId, action, timestamp, JSON.stringify(details)]);
    } catch (err) {
      console.error('Failed to write activity log:', err.message);
      // Fail silently for system logging or throw depending on design.
      // Here we throw DatabaseError because database consistency and auditing are requested.
      throw new DatabaseError(`Logging audit trail failed: ${err.message}`);
    }
  }

  async getByEmployeeId(employeeId) {
    try {
      const sql = 'SELECT * FROM activity_logs WHERE employee_id = ? ORDER BY timestamp DESC';
      const rows = await db.all(sql, [employeeId]);
      return rows.map(row => ({
        id: row.id,
        employee_id: row.employee_id,
        action: row.action,
        timestamp: row.timestamp,
        details: JSON.parse(row.details)
      }));
    } catch (err) {
      throw new DatabaseError(`Failed to retrieve activity logs: ${err.message}`);
    }
  }
}
