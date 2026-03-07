import AppError from '../utils/appError.js';

const handleCastErrorDB = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicatedFieldsDB = (error) => {
  const value = error.keyValue.name;
  const message = `Duplicate field value: ${value} . Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((value) => value.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please login again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again!', 401);

const sendErrorDev = (error, response) => {
  response.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    error: error,
    stack: error.stack,
  });
};

const sendErrorProd = (error, response) => {
  if (error.isOperational) {
    response.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    console.error('ERROR', error);

    response.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

export default (error, request, response, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, response);
  } else if (process.env.NODE_ENV === 'production') {
    let newError = Object.create(error);

    if (newError.name === 'CastError') {
      newError = handleCastErrorDB(newError);
    }

    if (newError.name === 'ValidationError') {
      newError = handleValidationError(newError);
    }

    if (newError.code === 11000) {
      newError = handleDuplicatedFieldsDB(newError);
    }

    if (newError.name === 'JsonWebTokenError') {
      newError = handleJWTError();
    }

    if (newError.name === 'TokenExpiredError') {
      newError = handleJWTExpiredError();
    }

    sendErrorProd(newError, response);
  }
};
