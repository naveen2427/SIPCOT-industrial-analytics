import { LibraryService } from '../services/LibraryService.js';

export class BookController {
  constructor() {
    this.libraryService = new LibraryService();
  }

  getAll = async (req, res, next) => {
    try {
      const { search, genre, availableOnly, sortBy, sortOrder, limit, offset } = req.query;
      
      const filters = {
        search: search || '',
        genre: genre || '',
        availableOnly: availableOnly === 'true',
        sortBy: sortBy || 'title',
        sortOrder: sortOrder || 'ASC',
        limit: limit ? parseInt(limit, 10) : 10,
        offset: offset ? parseInt(offset, 10) : 0
      };

      const result = await this.libraryService.bookRepo.getAll(filters);
      res.status(200).json({
        success: true,
        data: result.books,
        total: result.totalCount,
        limit: filters.limit,
        offset: filters.offset
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const book = await this.libraryService.bookRepo.getById(parseInt(id, 10));
      if (!book) {
        return res.status(404).json({ success: false, message: `Book with ID ${id} not found.` });
      }
      res.status(200).json({ success: true, data: book });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const newBook = await this.libraryService.onboardBook(req.body);
      res.status(201).json({
        success: true,
        message: 'Book successfully registered to catalog.',
        data: newBook
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await this.libraryService.updateBook(parseInt(id, 10), req.body);
      res.status(200).json({
        success: true,
        message: 'Book records updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.libraryService.bookRepo.delete(parseInt(id, 10));
      res.status(200).json({
        success: true,
        message: 'Book successfully removed from catalog.'
      });
    } catch (err) {
      next(err);
    }
  };
}
