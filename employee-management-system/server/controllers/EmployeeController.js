import { EmployeeService } from '../services/EmployeeService.js';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository.js';

export class EmployeeController {
  constructor() {
    this.employeeService = new EmployeeService();
    this.activityLogRepo = new ActivityLogRepository();
  }

  getAll = async (req, res, next) => {
    try {
      const { search, departmentId, status, sortBy, sortOrder, limit, offset } = req.query;
      
      const filters = {
        search: search || '',
        departmentId: departmentId ? parseInt(departmentId, 10) : null,
        status: status || '',
        sortBy: sortBy || 'last_name',
        sortOrder: sortOrder || 'ASC',
        limit: limit ? parseInt(limit, 10) : 10,
        offset: offset ? parseInt(offset, 10) : 0
      };

      const result = await this.employeeService.listEmployees(filters);
      res.status(200).json({
        success: true,
        data: result.employees,
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
      const employee = await this.employeeService.getEmployeeById(parseInt(id, 10));
      res.status(200).json({
        success: true,
        data: employee
      });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const newEmployee = await this.employeeService.onboardEmployee(req.body);
      res.status(201).json({
        success: true,
        message: 'Employee onboarded successfully.',
        data: newEmployee
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedEmployee = await this.employeeService.updateEmployee(parseInt(id, 10), req.body);
      res.status(200).json({
        success: true,
        message: 'Employee record updated successfully.',
        data: updatedEmployee
      });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.employeeService.removeEmployee(parseInt(id, 10));
      res.status(200).json({
        success: true,
        message: 'Employee record successfully archived/deleted.'
      });
    } catch (err) {
      next(err);
    }
  };

  getStats = async (req, res, next) => {
    try {
      const stats = await this.employeeService.getDashboardStatistics();
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (err) {
      next(err);
    }
  };

  getLogs = async (req, res, next) => {
    try {
      const { id } = req.params;
      const logs = await this.activityLogRepo.getByEmployeeId(parseInt(id, 10));
      res.status(200).json({
        success: true,
        data: logs
      });
    } catch (err) {
      next(err);
    }
  };
}
