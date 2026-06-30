import db from '../config/Database.js';
import { Member } from '../models/Member.js';
import { DatabaseError } from '../errors/AppErrors.js';

export class MemberRepository {
  async getById(id) {
    try {
      const row = await db.get('SELECT * FROM members WHERE id = ?', [id]);
      return Member.fromDatabaseRow(row);
    } catch (err) {
      throw new DatabaseError(`Failed to fetch member by ID: ${err.message}`);
    }
  }

  async getByEmail(email) {
    try {
      const row = await db.get('SELECT * FROM members WHERE email = ?', [email?.trim()?.toLowerCase()]);
      return Member.fromDatabaseRow(row);
    } catch (err) {
      throw new DatabaseError(`Failed to fetch member by email: ${err.message}`);
    }
  }

  async getAll({ search = '', status = '', sortBy = 'last_name', sortOrder = 'ASC', limit = 10, offset = 0 } = {}) {
    try {
      let query = 'SELECT * FROM members WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern, searchPattern);
      }

      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }

      const countQuery = `SELECT COUNT(*) as count FROM (${query})`;
      const countResult = await db.get(countQuery, params);
      const totalCount = countResult ? countResult.count : 0;

      const allowedSortColumns = ['first_name', 'last_name', 'joined_date', 'status'];
      const actualSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'last_name';
      const actualSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      query += ` ORDER BY ${actualSortBy} ${actualSortOrder} LIMIT ? OFFSET ?`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const rows = await db.all(query, params);
      const members = rows.map(row => Member.fromDatabaseRow(row));

      return { members, totalCount };
    } catch (err) {
      throw new DatabaseError(`Failed to retrieve members list: ${err.message}`);
    }
  }

  async create(member) {
    try {
      const sql = `
        INSERT INTO members (first_name, last_name, email, phone, joined_date, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const result = await db.run(sql, [
        member.first_name,
        member.last_name,
        member.email,
        member.phone,
        member.joined_date,
        member.status
      ]);
      member.id = result.id;
      return member;
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed: members.email')) {
        throw new Error('UNIQUE_EMAIL_CONFLICT');
      }
      throw new DatabaseError(`Failed to save member profile: ${err.message}`);
    }
  }

  async update(member) {
    try {
      const sql = `
        UPDATE members 
        SET first_name = ?, last_name = ?, email = ?, phone = ?, joined_date = ?, status = ?
        WHERE id = ?
      `;
      const result = await db.run(sql, [
        member.first_name,
        member.last_name,
        member.email,
        member.phone,
        member.joined_date,
        member.status,
        member.id
      ]);
      return result.changes > 0;
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed: members.email')) {
        throw new Error('UNIQUE_EMAIL_CONFLICT');
      }
      throw new DatabaseError(`Failed to update member profile: ${err.message}`);
    }
  }

  async delete(id) {
    try {
      const result = await db.run('DELETE FROM members WHERE id = ?', [id]);
      return result.changes > 0;
    } catch (err) {
      if (err.message.includes('FOREIGN KEY constraint failed')) {
        throw new Error('FOREIGN_KEY_CONFLICT');
      }
      throw new DatabaseError(`Failed to delete member: ${err.message}`);
    }
  }

  async getGeneralStats() {
    try {
      const total = await db.get('SELECT COUNT(*) as count FROM members');
      const active = await db.get("SELECT COUNT(*) as count FROM members WHERE status = 'Active'");
      return {
        totalMembers: total ? total.count : 0,
        activeMembers: active ? active.count : 0
      };
    } catch (err) {
      throw new DatabaseError(`Failed to retrieve member stats: ${err.message}`);
    }
  }
}
export default MemberRepository;
