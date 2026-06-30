import { ValidationError } from '../errors/AppErrors.js';

export class Loan {
  constructor({
    id = null,
    book_id,
    member_id,
    borrow_date,
    due_date,
    return_date = null,
    fine_amount = 0,
    book_title = null, // join details
    member_name = null
  }) {
    this.id = id;
    this.book_id = parseInt(book_id, 10);
    this.member_id = parseInt(member_id, 10);
    this.borrow_date = borrow_date;
    this.due_date = due_date;
    this.return_date = return_date;
    this.fine_amount = parseFloat(fine_amount || 0);
    
    this.book_title = book_title;
    this.member_name = member_name;
  }

  get isOverdue() {
    if (this.return_date) return false;
    const due = new Date(this.due_date);
    const now = new Date();
    // Reset hours to compare dates cleanly
    due.setHours(0,0,0,0);
    now.setHours(0,0,0,0);
    return now > due;
  }

  // Late fee: ₹10 per day late
  get computedFine() {
    if (this.return_date) {
      return this.fine_amount; // fixed fine paid / calculated at return
    }
    
    const due = new Date(this.due_date);
    const now = new Date();
    due.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    if (now <= due) {
      return 0;
    }

    const diffTime = Math.abs(now - due);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * 10; // ₹10 per day late fee rule
  }

  validate() {
    const errors = {};

    if (isNaN(this.book_id) || this.book_id <= 0) {
      errors.book_id = 'Valid book ID must be specified.';
    }

    if (isNaN(this.member_id) || this.member_id <= 0) {
      errors.member_id = 'Valid member ID must be specified.';
    }

    if (!this.borrow_date) errors.borrow_date = 'Borrow date is required.';
    if (!this.due_date) errors.due_date = 'Due date is required.';

    if (this.borrow_date && this.due_date) {
      const bDate = new Date(this.borrow_date);
      const dDate = new Date(this.due_date);
      if (dDate <= bDate) {
        errors.due_date = 'Due date must be after the borrow date.';
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed for Loan records details.', errors);
    }
  }

  static fromDatabaseRow(row) {
    if (!row) return null;
    return new Loan({
      id: row.id,
      book_id: row.book_id,
      member_id: row.member_id,
      borrow_date: row.borrow_date,
      due_date: row.due_date,
      return_date: row.return_date,
      fine_amount: row.fine_amount,
      book_title: row.book_title || null,
      member_name: row.member_name || null
    });
  }
}
