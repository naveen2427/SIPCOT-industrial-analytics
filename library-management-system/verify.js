import db from './server/config/Database.js';
import { SCHEMA, SEED_DATA } from './server/config/schema.js';
import { Book } from './server/models/Book.js';
import { Member } from './server/models/Member.js';
import { Loan } from './server/models/Loan.js';
import { LibraryService } from './server/services/LibraryService.js';
import { ValidationError, LoanError } from './server/errors/AppErrors.js';

async function runVerification() {
  console.log('==================================================');
  console.log('    STARTING LIBRARY SYSTEM VERIFICATION TEST     ');
  console.log('==================================================');

  const service = new LibraryService();

  try {
    // 1. Fresh schema setup
    console.log('\n[TEST 1] Initializing fresh SQLite schema...');
    await db.exec('DROP TABLE IF EXISTS activity_logs;');
    await db.exec('DROP TABLE IF EXISTS loans;');
    await db.exec('DROP TABLE IF EXISTS members;');
    await db.exec('DROP TABLE IF EXISTS books;');
    await db.exec(SCHEMA);
    console.log('-> SUCCESS: Database tables established.');

    // 2. Validate Seed data & Relational constraints
    console.log('\n[TEST 2] Seeding and checking relational constraints...');
    await SEED_DATA(db);
    
    const booksList = await service.bookRepo.getAll({ limit: 10 });
    const membersList = await service.memberRepo.getAll({ limit: 10 });
    console.log(`-> SUCCESS: Seeding complete. Loaded ${booksList.totalCount} books & ${membersList.totalCount} members.`);

    // 3. Test OOP book validation
    console.log('\n[TEST 3] Verifying Book validations...');
    const invalidBook = new Book({
      title: '', // should fail
      author: 'A', // too short
      isbn: '123', // invalid isbn format
      genre: '', // should fail
      published_year: 3000, // future year
      total_copies: -5, // negative
      shelf_location: ''
    });

    try {
      invalidBook.validate();
      console.error('-> FAILURE: Invalid book bypassed validation!');
      process.exit(1);
    } catch (err) {
      if (err instanceof ValidationError) {
        console.log('-> SUCCESS: Caught ValidationError. Validation errors found:', Object.keys(err.errors));
      } else {
        throw err;
      }
    }

    // 4. Test Transactional Borrow Checkout pipeline
    console.log('\n[TEST 4] Verifying Checkout loans transaction rules...');
    
    const book = booksList.books[0]; // "The Guide" (5 copies)
    const member = membersList.members[0]; // Rajesh Kumar

    console.log(`Borrowing "${book.title}" (ID: ${book.id}) to ${member.fullName} (ID: ${member.id})...`);
    const loan = await service.checkoutBook(book.id, member.id, 14);
    console.log('-> SUCCESS: Borrow record created. Loan ID:', loan.id);

    // Verify copies decremented
    const updatedBook = await service.bookRepo.getById(book.id);
    console.log(`   Available copies remaining: ${updatedBook.available_copies} (Initial: ${book.available_copies})`);
    if (updatedBook.available_copies !== book.available_copies - 1) {
      console.error('-> FAILURE: Available copies did not decrement!');
      process.exit(1);
    }
    console.log('-> SUCCESS: Available copies correctly decremented.');

    // Test duplicate checkout prevention
    try {
      await service.checkoutBook(book.id, member.id);
      console.error('-> FAILURE: Allowed duplicate checkout of same book!');
      process.exit(1);
    } catch (err) {
      if (err instanceof LoanError) {
        console.log('-> SUCCESS: Blocked duplicate checkout:', err.message);
      } else {
        throw err;
      }
    }

    // Test max loan limit (3 books limit check)
    // राजेश कुमार has 1 active loan. Let's borrow 2 more books.
    const book2 = booksList.books[1];
    const book3 = booksList.books[2];
    const book4 = booksList.books[3];

    await service.checkoutBook(book2.id, member.id);
    await service.checkoutBook(book3.id, member.id);
    console.log(`   Issued 3 books to ${member.fullName} successfully.`);

    // Trying to borrow 4th book should fail
    try {
      await service.checkoutBook(book4.id, member.id);
      console.error('-> FAILURE: Bypassed borrowing limit of 3 books!');
      process.exit(1);
    } catch (err) {
      if (err instanceof LoanError) {
        console.log('-> SUCCESS: Blocked 4th book checkout:', err.message);
      } else {
        throw err;
      }
    }

    // 5. Test Transactional return & late fine computation
    console.log('\n[TEST 5] Verifying Return transactions and Late Fees...');
    
    // Rajesh returns "The Guide" (loan.id)
    console.log(`Returning loan ID: ${loan.id}...`);
    const returnedLoan = await service.returnBook(loan.id);
    console.log(`-> SUCCESS: Return transaction saved. Fine charged: ₹${returnedLoan.fine_amount}`);

    // Verify copies incremented
    const returnedBook = await service.bookRepo.getById(book.id);
    console.log(`   Available copies now: ${returnedBook.available_copies}`);
    if (returnedBook.available_copies !== updatedBook.available_copies + 1) {
      console.error('-> FAILURE: Available copies did not increment back!');
      process.exit(1);
    }
    console.log('-> SUCCESS: Available copies correctly incremented.');

    // Test late fine calculation of ₹10 per day late
    console.log('   Creating overdue test loan (due 5 days ago)...');
    const bDate = new Date();
    bDate.setDate(bDate.getDate() - 10);
    const dDate = new Date();
    dDate.setDate(dDate.getDate() - 5); // due 5 days ago
    
    const overdueLoan = new Loan({
      book_id: book4.id,
      member_id: member.id,
      borrow_date: bDate.toISOString().split('T')[0],
      due_date: dDate.toISOString().split('T')[0]
    });
    
    console.log('   Accrued fine computed (should be ₹50):', overdueLoan.computedFine);
    if (overdueLoan.computedFine !== 50) {
      console.error('-> FAILURE: Fine calculation is incorrect! Expected 50, got:', overdueLoan.computedFine);
      process.exit(1);
    }
    console.log('-> SUCCESS: Overdue fine calculated correctly (₹10/day * 5 days = ₹50).');

    // 6. Reset database to seeded clean state for runtime use
    console.log('\n[TEST 6] Re-seeding database for application runtime...');
    await db.exec('DROP TABLE IF EXISTS activity_logs;');
    await db.exec('DROP TABLE IF EXISTS loans;');
    await db.exec('DROP TABLE IF EXISTS members;');
    await db.exec('DROP TABLE IF EXISTS books;');
    await db.exec(SCHEMA);
    await SEED_DATA(db);
    console.log('-> SUCCESS: Database seeded.');

    console.log('\n==================================================');
    console.log('    VERIFICATION COMPLETED: ALL TESTS PASSED!     ');
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
