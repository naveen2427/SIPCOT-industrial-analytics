import db from '../config/Database.js';
import { DatabaseError } from '../errors/AppErrors.js';

export class ActivityLogRepository {
  async log(bookId, memberId, action, details) {
    try {
      const timestamp = new Date().toISOString();
      const sql = 'INSERT INTO activity_logs (book_id, member_id, action, timestamp, details) VALUES (?, ?, ?, ?, ?)';
      await db.run(sql, [bookId, memberId, action, timestamp, JSON.stringify(details)]);
    } catch (err) {
      console.error('Failed to write activity log:', err.message);
      throw new DatabaseError(`Logging audit trail failed: ${err.message}`);
    }
  }

  async getByMemberId(memberId) {
    try {
      const sql = `
        SELECT l.*, b.title as book_title 
        FROM activity_logs l
        LEFT JOIN books b ON l.book_id = b.id
        WHERE l.member_id = ? 
        ORDER BY l.timestamp DESC
      `;
      const rows = await db.all(sql, [memberId]);
      return rows.map(row => ({
        id: row.id,
        book_id: row.book_id,
        book_title: row.book_title || 'N/A',
        member_id: row.member_id,
        action: row.action,
        timestamp: row.timestamp,
        details: JSON.parse(row.details)
      }));
    } catch (err) {
      throw new DatabaseError(`Failed to retrieve member activity logs: ${err.message}`);
    }
  }
}
export default ActivityLogRepository;
