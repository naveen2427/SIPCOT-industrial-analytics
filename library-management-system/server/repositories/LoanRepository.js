import db from '../config/Database.js';
import { Loan } from '../models/Loan.js';
import { DatabaseError } from '../errors/AppErrors.js';

export class LoanRepository {
  async getById(id) {
    try {
      const sql = `
        SELECT l.*, b.title as book_title, (m.first_name || ' ' || m.last_name) as member_name
        FROM loans l
        JOIN books b ON l.book_id = b.id
        JOIN members m ON l.member_id = m.id
        WHERE l.id = ?
      `;
      const row = await db.get(sql, [id]);
      return Loan.fromDatabaseRow(row);
    } catch (err) {
      throw new DatabaseError(`Failed to fetch loan transaction by ID: ${err.message}`);
    }
  }

  async getActiveLoanByBookAndMember(bookId, memberId) {
    try {
      const sql = 'SELECT * FROM loans WHERE book_id = ? AND member_id = ? AND return_date IS NULL';
      const row = await db.get(sql, [bookId, memberId]);
      return Loan.fromDatabaseRow(row);
    } catch (err) {
      throw new DatabaseError(`Failed to fetch active loan: ${err.message}`);
    }
  }

  async getAll({ search = '', bookId = null, memberId = null, activeOnly = false, limit = 10, offset = 0 } = {}) {
    try {
      let query = `
        SELECT l.*, b.title as book_title, (m.first_name || ' ' || m.last_name) as member_name
        FROM loans l
        JOIN books b ON l.book_id = b.id
        JOIN members m ON l.member_id = m.id
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        query += ` AND (b.title LIKE ? OR m.first_name LIKE ? OR m.last_name LIKE ?)`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      if (bookId) {
        query += ' AND l.book_id = ?';
        params.push(parseInt(bookId, 10));
      }

      if (memberId) {
        query += ' AND l.member_id = ?';
        params.push(parseInt(memberId, 10));
      }

      if (activeOnly) {
        query += ' AND l.return_date IS NULL';
      }

      const countQuery = `SELECT COUNT(*) as count FROM (${query})`;
      const countResult = await db.get(countQuery, params);
      const totalCount = countResult ? countResult.count : 0;

      query += ` ORDER BY l.borrow_date DESC LIMIT ? OFFSET ?`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const rows = await db.all(query, params);
      const loans = rows.map(row => Loan.fromDatabaseRow(row));

      return { loans, totalCount };
    } catch (err) {
      throw new DatabaseError(`Failed to retrieve loans history list: ${err.message}`);
    }
  }

  async create(loan) {
    try {
      const sql = `
        INSERT INTO loans (book_id, member_id, borrow_date, due_date, return_date, fine_amount)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const result = await db.run(sql, [
        loan.book_id,
        loan.member_id,
        loan.borrow_date,
        loan.due_date,
        loan.return_date,
        loan.fine_amount
      ]);
      loan.id = result.id;
      return loan;
    } catch (err) {
      throw new DatabaseError(`Failed to save loan transaction: ${err.message}`);
    }
  }

  async update(loan) {
    try {
      const sql = `
        UPDATE loans 
        SET return_date = ?, fine_amount = ?
        WHERE id = ?
      `;
      const result = await db.run(sql, [
        loan.return_date,
        loan.fine_amount,
        loan.id
      ]);
      return result.changes > 0;
    } catch (err) {
      throw new DatabaseError(`Failed to update loan record: ${err.message}`);
    }
  }

  async getActiveLoansCountByMember(memberId) {
    try {
      const sql = 'SELECT COUNT(*) as count FROM loans WHERE member_id = ? AND return_date IS NULL';
      const result = await db.get(sql, [memberId]);
      return result ? result.count : 0;
    } catch (err) {
      throw new DatabaseError(`Failed to count member active loans: ${err.message}`);
    }
  }

  async getOverdueCount() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const sql = "SELECT COUNT(*) as count FROM loans WHERE return_date IS NULL AND due_date < ?";
      const result = await db.get(sql, [today]);
      return result ? result.count : 0;
    } catch (err) {
      throw new DatabaseError(`Failed to count overdue loans: ${err.message}`);
    }
  }
}
export default LoanRepository;
