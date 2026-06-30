import db from '../config/Database.js';
import { Book } from '../models/Book.js';
import { Member } from '../models/Member.js';
import { Loan } from '../models/Loan.js';
import { BookRepository } from '../repositories/BookRepository.js';
import { MemberRepository } from '../repositories/MemberRepository.js';
import { LoanRepository } from '../repositories/LoanRepository.js';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository.js';
import { NotFoundError, ValidationError, LoanError, ConflictError } from '../errors/AppErrors.js';

export class LibraryService {
  constructor() {
    this.bookRepo = new BookRepository();
    this.memberRepo = new MemberRepository();
    this.loanRepo = new LoanRepository();
    this.activityLogRepo = new ActivityLogRepository();
  }

  // 1. Transactional Borrow / Checkout Book Flow
  async checkoutBook(bookId, memberId, borrowDays = 14) {
    const book = await this.bookRepo.getById(bookId);
    if (!book) throw new NotFoundError(`Book with ID ${bookId} not found in catalog.`);
    
    if (!book.isAvailable) {
      throw new LoanError(`Book "${book.title}" has no available copies left on shelf.`);
    }

    const member = await this.memberRepo.getById(memberId);
    if (!member) throw new NotFoundError(`Member with ID ${memberId} not found in registry.`);

    if (member.status !== 'Active') {
      throw new LoanError(`Cannot checkout. Member status is currently "${member.status}".`);
    }

    // Check outstanding borrow limit (Max 3 active loans per member)
    const activeCount = await this.loanRepo.getActiveLoansCountByMember(memberId);
    if (activeCount >= 3) {
      throw new LoanError(`Borrow limit reached. Member already has ${activeCount} active book loans (Limit: 3).`);
    }

    // Check duplicate checkouts (Member cannot checkout the same book twice simultaneously)
    const duplicate = await this.loanRepo.getActiveLoanByBookAndMember(bookId, memberId);
    if (duplicate) {
      throw new LoanError(`Member has already borrowed a copy of "${book.title}" and not returned it yet.`);
    }

    const borrowDate = new Date().toISOString().split('T')[0];
    const due = new Date();
    due.setDate(due.getDate() + borrowDays);
    const dueDate = due.toISOString().split('T')[0];

    const loan = new Loan({
      book_id: bookId,
      member_id: memberId,
      borrow_date: borrowDate,
      due_date: dueDate
    });
    loan.validate();

    return await db.transaction(async () => {
      // Create loan record
      const savedLoan = await this.loanRepo.create(loan);
      // Decrement available copies
      await this.bookRepo.updateAvailableCopies(bookId, -1);
      // Log checkout event
      await this.activityLogRepo.log(bookId, memberId, 'CHECKED_OUT', {
        message: `Book "${book.title}" checked out to ${member.fullName}.`,
        dueDate,
        operator: 'Librarian Desk'
      });
      return savedLoan;
    });
  }

  // 2. Transactional Return Book Flow
  async returnBook(loanId) {
    const loan = await this.loanRepo.getById(loanId);
    if (!loan) throw new NotFoundError(`Loan record with ID ${loanId} not found.`);
    if (loan.return_date) throw new LoanError('This book has already been returned.');

    const returnDate = new Date().toISOString().split('T')[0];
    const calculatedFine = loan.computedFine; // late fee ₹10 per day rule

    loan.return_date = returnDate;
    loan.fine_amount = calculatedFine;

    return await db.transaction(async () => {
      // Update loan status
      await this.loanRepo.update(loan);
      // Increment available copies
      await this.bookRepo.updateAvailableCopies(loan.book_id, 1);
      // Log return event
      await this.activityLogRepo.log(loan.book_id, loan.member_id, 'RETURNED', {
        message: `Book returned.`,
        finePaid: calculatedFine,
        operator: 'Librarian Desk'
      });
      return loan;
    });
  }

  // 3. Books Operations
  async onboardBook(data) {
    const book = new Book(data);
    book.validate();

    // Check duplicate ISBN
    const existing = await this.bookRepo.getByIsbn(book.isbn);
    if (existing) {
      throw new ConflictError(`ISBN ${book.isbn} is already registered under "${existing.title}".`);
    }

    return await this.bookRepo.create(book);
  }

  async updateBook(id, data) {
    const existing = await this.bookRepo.getById(id);
    if (!existing) throw new NotFoundError(`Book with ID ${id} not found.`);

    const merged = { ...existing, ...data, id };
    const updatedBook = new Book(merged);
    updatedBook.validate();

    if (updatedBook.isbn !== existing.isbn) {
      const isbnOwner = await this.bookRepo.getByIsbn(updatedBook.isbn);
      if (isbnOwner) {
        throw new ConflictError(`ISBN ${updatedBook.isbn} is already in use by another book.`);
      }
    }

    await this.bookRepo.update(updatedBook);
    return updatedBook;
  }

  // 4. Members Operations
  async registerMember(data) {
    const member = new Member(data);
    member.validate();

    const existing = await this.memberRepo.getByEmail(member.email);
    if (existing) {
      throw new ConflictError(`Email ${member.email} is already registered to member "${existing.fullName}".`);
    }

    return await this.memberRepo.create(member);
  }

  async updateMember(id, data) {
    const existing = await this.memberRepo.getById(id);
    if (!existing) throw new NotFoundError(`Member with ID ${id} not found.`);

    const merged = { ...existing, ...data, id };
    const updatedMember = new Member(merged);
    updatedMember.validate();

    if (updatedMember.email !== existing.email) {
      const emailOwner = await this.memberRepo.getByEmail(updatedMember.email);
      if (emailOwner) {
        throw new ConflictError(`Email ${updatedMember.email} is already registered.`);
      }
    }

    await this.memberRepo.update(updatedMember);
    return updatedMember;
  }

  // 5. Analytics Statistics
  async getDashboardStatistics() {
    const generalCatalog = await this.bookRepo.getGeneralStats();
    const generalMembers = await this.memberRepo.getGeneralStats();
    const overdueCount = await this.loanRepo.getOverdueCount();
    const genres = await this.bookRepo.getGenreStats();

    return {
      general: {
        totalBooks: generalCatalog.totalBooks,
        totalCopies: generalCatalog.totalCopies,
        checkedOut: generalCatalog.checkedOut,
        totalMembers: generalMembers.totalMembers,
        activeMembers: generalMembers.activeMembers,
        overdueCount
      },
      genres
    };
  }
}
export default LibraryService;
