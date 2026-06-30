import { AppError } from '../errors/AppErrors.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] Error occurred during ${req.method} ${req.url}:`);
  console.error(err.stack || err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null
    });
  }

  // Handle unique ISBN constraint conflict
  if (err.message === 'UNIQUE_ISBN_CONFLICT') {
    return res.status(409).json({
      success: false,
      message: 'This ISBN number is already registered under another catalog book.',
      errors: { isbn: 'ISBN number already exists in catalog.' }
    });
  }

  // Handle unique Email constraint conflict
  if (err.message === 'UNIQUE_EMAIL_CONFLICT') {
    return res.status(409).json({
      success: false,
      message: 'This email address is already in use by another library member.',
      errors: { email: 'Email address is already registered.' }
    });
  }

  // Handle foreign key conflicts (e.g. deleting a book currently loaned out)
  if (err.message === 'FOREIGN_KEY_CONFLICT') {
    return res.status(409).json({
      success: false,
      message: 'Resource conflict: Cannot delete because it is referenced in transactions/loans.',
      errors: null
    });
  }

  // Fallback for unhandled unexpected exceptions (safeguards leak information)
  return res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred. Please contact the librarian desk.',
    errors: null
  });
};
