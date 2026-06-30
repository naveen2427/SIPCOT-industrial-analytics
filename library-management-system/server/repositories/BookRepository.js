import db from '../config/Database.js';
import { Book } from '../models/Book.js';
import { DatabaseError } from '../errors/AppErrors.js';

export class BookRepository {
  async getById(id) {
    try {
      const row = await db.get('SELECT * FROM books WHERE id = ?', [id]);
      return Book.fromDatabaseRow(row);
    } catch (err) {
      throw new DatabaseError(`Failed to fetch book by ID: ${err.message}`);
    }
  }

  async getByIsbn(isbn) {
    try {
      const normalized = isbn?.replace(/[-\s]/g, '');
      const row = await db.get('SELECT * FROM books WHERE isbn = ?', [normalized]);
      return Book.fromDatabaseRow(row);
    } catch (err) {
      throw new DatabaseError(`Failed to fetch book by ISBN: ${err.message}`);
    }
  }

  async getAll({ search = '', genre = '', availableOnly = false, sortBy = 'title', sortOrder = 'ASC', limit = 10, offset = 0 } = {}) {
    try {
      let query = 'SELECT * FROM books WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }

      if (genre) {
        query += ' AND genre = ?';
        params.push(genre);
      }

      if (availableOnly) {
        query += ' AND available_copies > 0';
      }

      // Count total matching records for pagination
      const countQuery = `SELECT COUNT(*) as count FROM (${query})`;
      const countResult = await db.get(countQuery, params);
      const totalCount = countResult ? countResult.count : 0;

      // Sort whitelist
      const allowedSortColumns = ['title', 'author', 'published_year', 'total_copies', 'available_copies'];
      const actualSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'title';
      const actualSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      query += ` ORDER BY ${actualSortBy} ${actualSortOrder} LIMIT ? OFFSET ?`;
      params.push(parseInt(limit, 10), parseInt(offset, 10));

      const rows = await db.all(query, params);
      const books = rows.map(row => Book.fromDatabaseRow(row));

      return { books, totalCount };
    } catch (err) {
      throw new DatabaseError(`Failed to retrieve catalog books list: ${err.message}`);
    }
  }

  async create(book) {
    try {
      const sql = `
        INSERT INTO books (title, author, isbn, genre, published_year, total_copies, available_copies, shelf_location)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await db.run(sql, [
        book.title,
        book.author,
        book.isbn,
        book.genre,
        book.published_year,
        book.total_copies,
        book.available_copies,
        book.shelf_location
      ]);
      book.id = result.id;
      return book;
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed: books.isbn')) {
        throw new Error('UNIQUE_ISBN_CONFLICT');
      }
      throw new DatabaseError(`Failed to write book record: ${err.message}`);
    }
  }

  async update(book) {
    try {
      const sql = `
        UPDATE books 
        SET title = ?, author = ?, isbn = ?, genre = ?, published_year = ?, total_copies = ?, available_copies = ?, shelf_location = ?
        WHERE id = ?
      `;
      const result = await db.run(sql, [
        book.title,
        book.author,
        book.isbn,
        book.genre,
        book.published_year,
        book.total_copies,
        book.available_copies,
        book.shelf_location,
        book.id
      ]);
      return result.changes > 0;
    } catch (err) {
      if (err.message.includes('UNIQUE constraint failed: books.isbn')) {
        throw new Error('UNIQUE_ISBN_CONFLICT');
      }
      throw new DatabaseError(`Failed to update book record: ${err.message}`);
    }
  }

  async updateAvailableCopies(bookId, delta) {
    try {
      const sql = 'UPDATE books SET available_copies = available_copies + ? WHERE id = ?';
      const result = await db.run(sql, [delta, bookId]);
      return result.changes > 0;
    } catch (err) {
      throw new DatabaseError(`Failed to update book available copies: ${err.message}`);
    }
  }

  async delete(id) {
    try {
      const result = await db.run('DELETE FROM books WHERE id = ?', [id]);
      return result.changes > 0;
    } catch (err) {
      if (err.message.includes('FOREIGN KEY constraint failed')) {
        throw new Error('FOREIGN_KEY_CONFLICT');
      }
      throw new DatabaseError(`Failed to delete book: ${err.message}`);
    }
  }

  async getGenreStats() {
    try {
      // Aggregates count of books per genre
      const query = `
        SELECT genre as name, COUNT(id) as value, SUM(total_copies) as total_copies, SUM(available_copies) as available_copies
        FROM books
        GROUP BY genre
      `;
      return await db.all(query);
    } catch (err) {
      throw new DatabaseError(`Failed to calculate genre statistics: ${err.message}`);
    }
  }

  async getGeneralStats() {
    try {
      const booksCount = await db.get('SELECT COUNT(*) as count FROM books');
      const copiesCount = await db.get('SELECT SUM(total_copies) as sum FROM books');
      const availableCount = await db.get('SELECT SUM(available_copies) as sum FROM books');
      
      const totalBooks = booksCount ? booksCount.count : 0;
      const totalCopies = copiesCount && copiesCount.sum ? copiesCount.sum : 0;
      const totalAvailable = availableCount && availableCount.sum ? availableCount.sum : 0;
      const checkedOut = totalCopies - totalAvailable;

      return {
        totalBooks,
        totalCopies,
        checkedOut,
        available: totalAvailable
      };
    } catch (err) {
      throw new DatabaseError(`Failed to fetch catalog metrics: ${err.message}`);
    }
  }
}
export default BookRepository;
