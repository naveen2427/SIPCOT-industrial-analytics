export const SCHEMA = `
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    genre TEXT NOT NULL,
    published_year INTEGER NOT NULL,
    total_copies INTEGER NOT NULL,
    available_copies INTEGER NOT NULL,
    shelf_location TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    joined_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active'
  );

  CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    borrow_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    return_date TEXT,
    fine_amount REAL DEFAULT 0,
    FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE RESTRICT,
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE RESTRICT
  );

  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER,
    member_id INTEGER,
    action TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    details TEXT NOT NULL,
    FOREIGN KEY(book_id) REFERENCES books(id) ON DELETE SET NULL,
    FOREIGN KEY(member_id) REFERENCES members(id) ON DELETE SET NULL
  );

  CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
  CREATE INDEX IF NOT EXISTS idx_books_title_author ON books(title, author);
  CREATE INDEX IF NOT EXISTS idx_loans_due_date ON loans(due_date);
  CREATE INDEX IF NOT EXISTS idx_loans_active ON loans(book_id, member_id) WHERE return_date IS NULL;
`;

export const SEED_DATA = async (db) => {
  // Seed Departments/Genres metadata
  const bookCount = await db.get('SELECT COUNT(*) as count FROM books');
  if (bookCount.count === 0) {
    console.log('Seeding initial books...');
    await db.run(`
      INSERT INTO books (title, author, isbn, genre, published_year, total_copies, available_copies, shelf_location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'The Guide', 'R.K. Narayan', '9780141189574', 'Fiction', 1958, 5, 5, 'Shelf A-1'
    ]);
    await db.run(`
      INSERT INTO books (title, author, isbn, genre, published_year, total_copies, available_copies, shelf_location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      "Midnight's Children", 'Salman Rushdie', '9780099578512', 'Historical Fiction', 1981, 3, 3, 'Shelf A-2'
    ]);
    await db.run(`
      INSERT INTO books (title, author, isbn, genre, published_year, total_copies, available_copies, shelf_location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'The God of Small Things', 'Arundhati Roy', '9780006550686', 'Drama', 1997, 4, 4, 'Shelf B-1'
    ]);
    await db.run(`
      INSERT INTO books (title, author, isbn, genre, published_year, total_copies, available_copies, shelf_location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Wings of Fire', 'A.P.J. Abdul Kalam', '9788173711466', 'Biography', 1999, 6, 6, 'Shelf C-1'
    ]);
    await db.run(`
      INSERT INTO books (title, author, isbn, genre, published_year, total_copies, available_copies, shelf_location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'Train to Pakistan', 'Khushwant Singh', '9780143062226', 'History', 1956, 4, 4, 'Shelf D-1'
    ]);
  }

  // Seed Members
  const memberCount = await db.get('SELECT COUNT(*) as count FROM members');
  if (memberCount.count === 0) {
    console.log('Seeding initial library members...');
    await db.run(`
      INSERT INTO members (first_name, last_name, email, phone, joined_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'Rajesh', 'Kumar', 'rajesh.kumar@email.in', '+91 98765 11111', '2025-01-10', 'Active'
    ]);
    await db.run(`
      INSERT INTO members (first_name, last_name, email, phone, joined_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'Priya', 'Sharma', 'priya.sharma@email.in', '+91 98765 22222', '2025-02-15', 'Active'
    ]);
    await db.run(`
      INSERT INTO members (first_name, last_name, email, phone, joined_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      'Amit', 'Patel', 'amit.patel@email.in', '+91 98765 33333', '2025-03-20', 'Active'
    ]);
  }
};
