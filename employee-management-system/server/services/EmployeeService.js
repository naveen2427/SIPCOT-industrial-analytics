import db from '../config/Database.js';
import { Employee } from '../models/Employee.js';
import { EmployeeRepository } from '../repositories/EmployeeRepository.js';
import { DepartmentRepository } from '../repositories/DepartmentRepository.js';
import { ActivityLogRepository } from '../repositories/ActivityLogRepository.js';
import { NotFoundError, ConflictError, ValidationError } from '../errors/AppErrors.js';

export class EmployeeService {
  constructor() {
    this.employeeRepo = new EmployeeRepository();
    this.departmentRepo = new DepartmentRepository();
    this.activityLogRepo = new ActivityLogRepository();
  }

  async onboardEmployee(data) {
    const employee = new Employee(data);
    employee.validate(); // Throws ValidationError if fields are invalid

    // Check if department exists
    const dept = await this.departmentRepo.getById(employee.department_id);
    if (!dept) {
      throw new ValidationError('Department does not exist.', { department_id: 'Selected department is invalid.' });
    }

    // Check duplicate email
    const existing = await this.employeeRepo.getByEmail(employee.email);
    if (existing) {
      throw new ConflictError(`Email ${employee.email} is already registered to another employee.`);
    }

    return await db.transaction(async () => {
      const savedEmployee = await this.employeeRepo.create(employee);
      await this.activityLogRepo.log(savedEmployee.id, 'ONBOARDED', {
        message: 'Employee onboarding successful.',
        onboardedBy: 'System Administrator',
        initialSalary: savedEmployee.salary,
        department: dept.name
      });
      return savedEmployee;
    });
  }

  async updateEmployee(id, data) {
    const existing = await this.employeeRepo.getById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID ${id} not found.`);
    }

    // Merge changes
    const mergedData = { ...existing, ...data, id }; // Ensure id is preserved
    const updatedEmployee = new Employee(mergedData);
    updatedEmployee.validate();

    // Verify department exists
    const dept = await this.departmentRepo.getById(updatedEmployee.department_id);
    if (!dept) {
      throw new ValidationError('Department does not exist.', { department_id: 'Selected department is invalid.' });
    }

    // Check email availability if changed
    if (updatedEmployee.email !== existing.email) {
      const emailOwner = await this.employeeRepo.getByEmail(updatedEmployee.email);
      if (emailOwner) {
        throw new ConflictError(`Email ${updatedEmployee.email} is already in use by another employee.`);
      }
    }

    // Capture differences for audit trail
    const changes = {};
    const keysToCompare = ['first_name', 'last_name', 'email', 'phone', 'role', 'department_id', 'salary', 'status', 'bio', 'profile_image'];
    for (const key of keysToCompare) {
      if (updatedEmployee[key] !== existing[key]) {
        changes[key] = {
          from: existing[key],
          to: updatedEmployee[key]
        };
      }
    }

    if (Object.keys(changes).length === 0) {
      return existing; // No modifications made
    }

    return await db.transaction(async () => {
      await this.employeeRepo.update(updatedEmployee);
      await this.activityLogRepo.log(id, 'UPDATED', {
        message: 'Employee records updated.',
        updatedBy: 'System Administrator',
        changes
      });
      return updatedEmployee;
    });
  }

  async getEmployeeById(id) {
    const employee = await this.employeeRepo.getById(id);
    if (!employee) {
      throw new NotFoundError(`Employee with ID ${id} not found.`);
    }

    // Attach computed rules to final payload for UI representation
    const payload = {
      ...employee,
      fullName: employee.fullName,
      tenureInMonths: employee.tenureInMonths,
      taxBracket: employee.taxBracket,
      benefitsEligibility: employee.benefitsEligibility
    };

    // Log the record view for auditing compliance
    await this.activityLogRepo.log(id, 'VIEWED', {
      message: 'Employee record accessed.',
      accessedBy: 'System Administrator'
    });

    return payload;
  }

  async listEmployees(filters) {
    return await this.employeeRepo.getAll(filters);
  }

  async removeEmployee(id) {
    const existing = await this.employeeRepo.getById(id);
    if (!existing) {
      throw new NotFoundError(`Employee with ID ${id} not found.`);
    }

    return await db.transaction(async () => {
      // Create a log entry before removing (log has ON DELETE SET NULL on employee_id, which preserves audit)
      await this.activityLogRepo.log(id, 'ARCHIVED', {
        message: `Employee ${existing.fullName} records deleted from active database.`,
        deletedBy: 'System Administrator',
        lastSalary: existing.salary,
        lastRole: existing.role
      });
      return await this.employeeRepo.delete(id);
    });
  }

  async getDashboardStatistics() {
    const general = await this.employeeRepo.getGeneralStats();
    const departments = await this.employeeRepo.getDepartmentStats();
    return { general, departments };
  }
}
export default EmployeeService;
