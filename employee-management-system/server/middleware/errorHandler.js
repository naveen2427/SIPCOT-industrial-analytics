import { AppError } from '../errors/AppErrors.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] Error occurred during ${req.method} ${req.url}:`);
  console.error(err.stack || err);

  // Custom exceptions mapping
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null
    });
  }

  // Handle unique email error that might bypass manual check or happen via race condition
  if (err.message === 'UNIQUE_EMAIL_CONFLICT') {
    return res.status(409).json({
      success: false,
      message: 'Email address is already in use by another employee.',
      errors: { email: 'Email address is already registered.' }
    });
  }

  // Handle foreign key conflicts (e.g. deleting a department that has employees)
  if (err.message === 'FOREIGN_KEY_CONFLICT') {
    return res.status(409).json({
      success: false,
      message: 'Resource conflict: Cannot delete because it is referenced by other records.',
      errors: null
    });
  }

  // Fallback for unhandled unexpected exceptions (safeguards information accuracy/internal leaking)
  return res.status(500).json({
    success: false,
    message: 'An unexpected internal server error occurred. Please contact the administrator.',
    errors: null
  });
};
