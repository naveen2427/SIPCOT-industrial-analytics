import { LibraryService } from '../services/LibraryService.js';

export class MemberController {
  constructor() {
    this.libraryService = new LibraryService();
  }

  getAll = async (req, res, next) => {
    try {
      const { search, status, sortBy, sortOrder, limit, offset } = req.query;
      const filters = {
        search: search || '',
        status: status || '',
        sortBy: sortBy || 'last_name',
        sortOrder: sortOrder || 'ASC',
        limit: limit ? parseInt(limit, 10) : 10,
        offset: offset ? parseInt(offset, 10) : 0
      };
      const result = await this.libraryService.memberRepo.getAll(filters);
      res.status(200).json({
        success: true,
        data: result.members,
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
      const member = await this.libraryService.memberRepo.getById(parseInt(id, 10));
      if (!member) {
        return res.status(404).json({ success: false, message: `Member with ID ${id} not found.` });
      }
      res.status(200).json({ success: true, data: member });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const member = await this.libraryService.registerMember(req.body);
      res.status(201).json({
        success: true,
        message: 'Member registered successfully.',
        data: member
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await this.libraryService.updateMember(parseInt(id, 10), req.body);
      res.status(200).json({
        success: true,
        message: 'Member profile updated successfully.',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.libraryService.memberRepo.delete(parseInt(id, 10));
      res.status(200).json({
        success: true,
        message: 'Member profile successfully deleted.'
      });
    } catch (err) {
      next(err);
    }
  };

  getLogs = async (req, res, next) => {
    try {
      const { id } = req.params;
      const logs = await this.libraryService.activityLogRepo.getByMemberId(parseInt(id, 10));
      res.status(200).json({
        success: true,
        data: logs
      });
    } catch (err) {
      next(err);
    }
  };
}
