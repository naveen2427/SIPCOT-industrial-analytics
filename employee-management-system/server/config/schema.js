export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    manager_id INTEGER,
    FOREIGN KEY(manager_id) REFERENCES employees(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    role TEXT NOT NULL,
    department_id INTEGER NOT NULL,
    hire_date TEXT NOT NULL,
    salary REAL NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    bio TEXT,
    profile_image TEXT,
    FOREIGN KEY(department_id) REFERENCES departments(id) ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id INTEGER,
    action TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    details TEXT NOT NULL,
    FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_employees_email ON employees(email);
  CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(last_name, first_name);
  CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
  CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
`;

export const SEED_DATA = async (db) => {
  // Check if departments exist
  const deptCount = await db.get('SELECT COUNT(*) as count FROM departments');
  if (deptCount.count === 0) {
    console.log('Seeding initial departments...');
    await db.run('INSERT INTO departments (name, description) VALUES (?, ?)', [
      'Engineering', 'Product design, software development, and infrastructure'
    ]);
    await db.run('INSERT INTO departments (name, description) VALUES (?, ?)', [
      'Marketing', 'Brand positioning, sales operations, and growth campaigns'
    ]);
    await db.run('INSERT INTO departments (name, description) VALUES (?, ?)', [
      'Human Resources', 'Talent acquisition, employee relations, and culture'
    ]);
    await db.run('INSERT INTO departments (name, description) VALUES (?, ?)', [
      'Finance', 'Financial planning, accounting, and payroll'
    ]);
  }

  // Check if employees exist
  const empCount = await db.get('SELECT COUNT(*) as count FROM employees');
  if (empCount.count === 0) {
    console.log('Seeding initial employees...');
    
    const engDept = await db.get('SELECT id FROM departments WHERE name = ?', ['Engineering']);
    const mktDept = await db.get('SELECT id FROM departments WHERE name = ?', ['Marketing']);
    const hrDept = await db.get('SELECT id FROM departments WHERE name = ?', ['Human Resources']);
    const finDept = await db.get('SELECT id FROM departments WHERE name = ?', ['Finance']);

    // Seed some employees
    await db.run(`
      INSERT INTO employees (first_name, last_name, email, phone, role, department_id, hire_date, salary, status, bio, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Aarav', 'Sharma', 'aarav.sharma@corp.in', '+91 98765 00001', 'Engineering Manager', engDept.id, '2024-01-15', 2400000, 'Active',
      'Leads the software development team and software architecture plans.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    ]);

    await db.run(`
      INSERT INTO employees (first_name, last_name, email, phone, role, department_id, hire_date, salary, status, bio, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Rohan', 'Verma', 'rohan.verma@corp.in', '+91 98765 00002', 'Senior Software Engineer', engDept.id, '2024-06-10', 1600000, 'Active',
      'Specializes in database clustering, API building, and security controls.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
    ]);

    await db.run(`
      INSERT INTO employees (first_name, last_name, email, phone, role, department_id, hire_date, salary, status, bio, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Priya', 'Patel', 'priya.patel@corp.in', '+91 98765 00003', 'HR Director', hrDept.id, '2023-05-12', 1800000, 'Active',
      'Responsible for compliance, talent acquisition, and workforce management.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    ]);

    await db.run(`
      INSERT INTO employees (first_name, last_name, email, phone, role, department_id, hire_date, salary, status, bio, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Amit', 'Singh', 'amit.singh@corp.in', '+91 98765 00004', 'Marketing Director', mktDept.id, '2025-02-28', 1200000, 'Active',
      'Handles corporate branding, sales growth, and strategic operations.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
    ]);

    await db.run(`
      INSERT INTO employees (first_name, last_name, email, phone, role, department_id, hire_date, salary, status, bio, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Sneha', 'Reddy', 'sneha.reddy@corp.in', '+91 98765 00005', 'Financial Analyst', finDept.id, '2025-11-01', 900000, 'Active',
      'Prepares quarterly budget reports, financial estimates, and tax sheets.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    ]);

    // Update managers for departments
    const aarav = await db.get('SELECT id FROM employees WHERE email = ?', ['aarav.sharma@corp.in']);
    const priya = await db.get('SELECT id FROM employees WHERE email = ?', ['priya.patel@corp.in']);
    const amit = await db.get('SELECT id FROM employees WHERE email = ?', ['amit.singh@corp.in']);
    const sneha = await db.get('SELECT id FROM employees WHERE email = ?', ['sneha.reddy@corp.in']);

    await db.run('UPDATE departments SET manager_id = ? WHERE id = ?', [aarav.id, engDept.id]);
    await db.run('UPDATE departments SET manager_id = ? WHERE id = ?', [priya.id, hrDept.id]);
    await db.run('UPDATE departments SET manager_id = ? WHERE id = ?', [amit.id, mktDept.id]);
    await db.run('UPDATE departments SET manager_id = ? WHERE id = ?', [sneha.id, finDept.id]);
  }
};
