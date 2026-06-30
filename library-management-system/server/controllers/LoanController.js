import { LibraryService } from '../services/LibraryService.js';

export class LoanController {
  constructor() {
    this.libraryService = new LibraryService();
  }

  checkout = async (req, res, next) => {
    try {
      const { book_id, member_id, borrow_days } = req.body;
      const loan = await this.libraryService.checkoutBook(
        parseInt(book_id, 10),
        parseInt(member_id, 10),
        borrow_days ? parseInt(borrow_days, 10) : 14
      );
      res.status(201).json({
        success: true,
        message: 'Book checked out successfully.',
        data: loan
      });
    } catch (err) {
      next(err);
    }
  };

  returnBook = async (req, res, next) => {
    try {
      const { id } = req.params;
      const loan = await this.libraryService.returnBook(parseInt(id, 10));
      res.status(200).json({
        success: true,
        message: `Book successfully returned. Fine charged: ₹${loan.fine_amount}`,
        data: loan
      });
    } catch (err) {
      next(err);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const { search, bookId, memberId, activeOnly, limit, offset } = req.query;
      const filters = {
        search: search || '',
        bookId: bookId ? parseInt(bookId, 10) : null,
        memberId: memberId ? parseInt(memberId, 10) : null,
        activeOnly: activeOnly === 'true',
        limit: limit ? parseInt(limit, 10) : 10,
        offset: offset ? parseInt(offset, 10) : 0
      };
      
      const result = await this.libraryService.loanRepo.getAll(filters);
      
      // Map computed values on lists
      const data = result.loans.map(loan => ({
        ...loan,
        isOverdue: loan.isOverdue,
        computedFine: loan.computedFine
      }));

      res.status(200).json({
        success: true,
        data,
        total: result.totalCount,
        limit: filters.limit,
        offset: filters.offset
      });
    } catch (err) {
      next(err);
    }
  };

  getStats = async (req, res, next) => {
    try {
      const stats = await this.libraryService.getDashboardStatistics();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  };
}
export default LoanController;
