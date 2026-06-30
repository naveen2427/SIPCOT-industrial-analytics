import { ValidationError } from '../errors/AppErrors.js';

export class Book {
  constructor({
    id = null,
    title,
    author,
    isbn,
    genre,
    published_year,
    total_copies,
    available_copies = null,
    shelf_location
  }) {
    this.id = id;
    this.title = title?.trim();
    this.author = author?.trim();
    this.isbn = isbn?.trim()?.replace(/[-\s]/g, ''); // normalize isbn
    this.genre = genre?.trim();
    this.published_year = parseInt(published_year, 10);
    this.total_copies = parseInt(total_copies, 10);
    this.available_copies = available_copies !== null ? parseInt(available_copies, 10) : this.total_copies;
    this.shelf_location = shelf_location?.trim() || 'Unassigned';
  }

  get isAvailable() {
    return this.available_copies > 0;
  }

  get loanPercentage() {
    if (this.total_copies === 0) return 0;
    const loaned = this.total_copies - this.available_copies;
    return Math.round((loaned / this.total_copies) * 100);
  }

  validate() {
    const errors = {};

    if (!this.title) errors.title = 'Book title is required.';
    else if (this.title.length < 2) errors.title = 'Title must be at least 2 characters.';

    if (!this.author) errors.author = 'Author name is required.';
    else if (this.author.length < 2) errors.author = 'Author name must be at least 2 characters.';

    // ISBN-13 or ISBN-10 regex
    const isbnRegex = /^(?:\d{9}[\dX]|\d{13})$/;
    if (!this.isbn) errors.isbn = 'ISBN code is required.';
    else if (!isbnRegex.test(this.isbn)) errors.isbn = 'Invalid ISBN code (must be 10 or 13 digits).';

    if (!this.genre) errors.genre = 'Genre is required.';

    const currentYear = new Date().getFullYear();
    if (isNaN(this.published_year) || this.published_year < 1000 || this.published_year > currentYear) {
      errors.published_year = `Published year must be between 1000 and ${currentYear}.`;
    }

    if (isNaN(this.total_copies) || this.total_copies <= 0) {
      errors.total_copies = 'Total copies must be a positive integer.';
    }

    if (this.available_copies < 0 || this.available_copies > this.total_copies) {
      errors.available_copies = 'Available copies must be between 0 and total copies.';
    }

    if (!this.shelf_location) errors.shelf_location = 'Shelf location is required.';

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed for Book details.', errors);
    }
  }

  static fromDatabaseRow(row) {
    if (!row) return null;
    return new Book({
      id: row.id,
      title: row.title,
      author: row.author,
      isbn: row.isbn,
      genre: row.genre,
      published_year: row.published_year,
      total_copies: row.total_copies,
      available_copies: row.available_copies,
      shelf_location: row.shelf_location
    });
  }
}
