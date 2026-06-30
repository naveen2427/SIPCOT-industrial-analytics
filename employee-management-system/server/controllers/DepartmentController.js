import { DepartmentRepository } from '../repositories/DepartmentRepository.js';

export class DepartmentController {
  constructor() {
    this.departmentRepo = new DepartmentRepository();
  }

  getAll = async (req, res, next) => {
    try {
      const departments = await this.departmentRepo.getAll();
      res.status(200).json({
        success: true,
        data: departments
      });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const dept = await this.departmentRepo.getById(parseInt(id, 10));
      if (!dept) {
        return res.status(404).json({
          success: false,
          message: `Department with ID ${id} not found.`
        });
      }
      res.status(200).json({
        success: true,
        data: dept
      });
    } catch (err) {
      next(err);
    }
  };
}
