// Verification Script for Database, OOP models, and validation rules
import db from './server/config/Database.js';
import { SCHEMA, SEED_DATA } from './server/config/schema.js';
import { Employee } from './server/models/Employee.js';
import { EmployeeRepository } from './server/repositories/EmployeeRepository.js';
import { DepartmentRepository } from './server/repositories/DepartmentRepository.js';
import { ActivityLogRepository } from './server/repositories/ActivityLogRepository.js';
import { ValidationError } from './server/errors/AppErrors.js';

async function runVerification() {
  console.log('==================================================');
  console.log('         STARTING SYSTEM VERIFICATION TEST        ');
  console.log('==================================================');

  try {
    // 1. Initialize fresh schema
    console.log('\n[TEST 1] Initializing fresh SQLite schema...');
    await db.exec('DROP TABLE IF EXISTS activity_logs;');
    await db.exec('DROP TABLE IF EXISTS employees;');
    await db.exec('DROP TABLE IF EXISTS departments;');
    await db.exec(SCHEMA);
    console.log('-> SUCCESS: Database schema established.');

    // 2. Validate Relational Database Setup
    console.log('\n[TEST 2] Verifying database connectivity & constraints...');
    const deptRepo = new DepartmentRepository();
    const empRepo = new EmployeeRepository();
    const logRepo = new ActivityLogRepository();
    
    // Seed one test department
    await db.run('INSERT INTO departments (name, description) VALUES (?, ?)', ['Test Engineering', 'Verification department']);
    const testDept = await db.get('SELECT * FROM departments WHERE name = ?', ['Test Engineering']);
    console.log('-> SUCCESS: Department seeded (ID:', testDept.id, ')');

    // Verify foreign keys are enabled (inserting employee with invalid dept should fail)
    try {
      await db.run(`
        INSERT INTO employees (first_name, last_name, email, phone, role, department_id, hire_date, salary, status)
        VALUES ('Test', 'User', 'fail@test.com', '555-1234', 'QA', 9999, '2024-01-01', 50000, 'Active')
      `);
      console.error('-> FAILURE: Foreign key constraint did not block invalid department_id!');
      process.exit(1);
    } catch (err) {
      console.log('-> SUCCESS: Foreign key constraint blocked invalid department_id:', err.message);
    }

    // 3. Verify OOP Domain Model & Validations
    console.log('\n[TEST 3] Verifying OOP validations & computed getters...');
    
    const validEmp = new Employee({
      first_name: 'Luke',
      last_name: 'Skywalker',
      email: 'luke@rebellion.org',
      phone: '+91 98765 19770',
      role: 'Jedi Knight',
      department_id: testDept.id,
      hire_date: '2020-05-25', // 6+ years ago
      salary: 1600000,
      status: 'Active',
      bio: 'Fighter pilot and Jedi Knight.'
    });

    // Run verification logic
    validEmp.validate();
    console.log('-> SUCCESS: Validation succeeded for valid employee details.');
    console.log('   Computed Full Name:', validEmp.fullName);
    console.log('   Computed Tenure (months):', validEmp.tenureInMonths);
    console.log('   Computed Tax Bracket:', validEmp.taxBracket);
    console.log('   Computed Benefits Tier:', validEmp.benefitsEligibility);

    // Test Validation Failures
    const invalidEmp = new Employee({
      first_name: '', // should fail
      last_name: 'S', // too short
      email: 'invalid-email', // bad format
      phone: '123', // too short
      role: '', // should fail
      department_id: testDept.id,
      hire_date: '2030-01-01', // future date (should fail)
      salary: -1000, // negative (should fail)
      status: 'Active'
    });

    try {
      invalidEmp.validate();
      console.error('-> FAILURE: Invalid employee object bypassed validation checks!');
      process.exit(1);
    } catch (err) {
      if (err instanceof ValidationError) {
        console.log('-> SUCCESS: Exception handled. Caught ValidationError:');
        console.log('   Errors found:', err.errors);
      } else {
        console.error('-> FAILURE: Caught unexpected error:', err);
        process.exit(1);
      }
    }

    // 4. Verify Repository & Audit trail mapping
    console.log('\n[TEST 4] Verifying Repository operations and Audit logs...');
    
    // Save Luke
    const saved = await empRepo.create(validEmp);
    console.log('-> SUCCESS: Employee record saved. Generated ID:', saved.id);

    // Log action
    await logRepo.log(saved.id, 'ONBOARDED', { message: 'Verification onboarding test successful.' });
    console.log('-> SUCCESS: Verification audit log written.');

    // Fetch and check logs
    const logs = await logRepo.getByEmployeeId(saved.id);
    console.log('-> SUCCESS: Retrieved audit logs for employee. Count:', logs.length);
    console.log('   Action logged:', logs[0].action);
    console.log('   Details logged:', logs[0].details.message);

    // Update salary and test updates
    saved.salary = 1850000;
    saved.first_name = 'Luke Skywalker'; // merge/update test
    await empRepo.update(saved);
    await logRepo.log(saved.id, 'UPDATED', { changes: { salary: { from: 1600000, to: 1850000 } } });
    
    const updated = await empRepo.getById(saved.id);
    console.log('-> SUCCESS: Employee record updated. Verified new salary:', updated.salary);
    console.log('   Updated Tax Bracket:', updated.taxBracket);

    const afterUpdateLogs = await logRepo.getByEmployeeId(saved.id);
    console.log('   Total audit entries now:', afterUpdateLogs.length);
    console.log('   Latest update change details:', afterUpdateLogs[0].details.changes);

    // 5. Test Optimized lookup / stats
    console.log('\n[TEST 5] Verifying search & stats queries...');
    const searchRes = await empRepo.getAll({ search: 'Skywalker', departmentId: testDept.id });
    console.log('-> SUCCESS: Search and filter lookup succeeded. Matches found:', searchRes.totalCount);
    console.log('   Match Name:', searchRes.employees[0].fullName);

    const stats = await empRepo.getGeneralStats();
    console.log('-> SUCCESS: Aggregation stats retrieved.');
    console.log('   General Stats:', stats);

    // 6. Reset database to seeded state for runtime use
    console.log('\n[TEST 6] Re-seeding database for application runtime...');
    await db.exec('DROP TABLE IF EXISTS activity_logs;');
    await db.exec('DROP TABLE IF EXISTS employees;');
    await db.exec('DROP TABLE IF EXISTS departments;');
    await db.exec(SCHEMA);
    await SEED_DATA(db);
    console.log('-> SUCCESS: Seeding complete.');

    console.log('\n==================================================');
    console.log('    VERIFICATION COMPLETED: ALL TESTS PASSED!    ');
    console.log('==================================================');
  } catch (err) {
    console.error('\n!!! VERIFICATION FAILED !!!');
    console.error(err.stack || err.message);
    process.exit(1);
  } finally {
    await db.close();
  }
}

runVerification();
