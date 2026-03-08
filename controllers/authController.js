import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catcher from '../utils/catchAsync.js';

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

const signUp = catcher.asyncFuction(async (request, response, next) => {
  const { name, email, password, passwordConfirm, passwordChangedAt, role } =
    request.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  });

  const token = signToken(newUser._id);

  response.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catcher.asyncFuction(async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    await bcrypt.compare(
      password,
      '$2a$12$TQPfgMmHVIosBK0I.6XEo.Ekz.XRUtzJi3VpnAEOXefux84Se.zxC',
    );
    return next(new AppError('Incorrect email or password', 400));
  }

  const passwordIsCorrect = await user.correctPassword(password, user.password);

  if (!passwordIsCorrect) {
    return next(new AppError('Incorrect email or password', 400));
  }

  const token = signToken(user._id);

  response.status(200).json({
    status: 'success',
    token,
  });
});

const protect = catcher.asyncFuction(async (request, response, next) => {
  let token;

  if (request.headers.authorization) {
    token = request.headers.authorization.split(' ')[1];
  }
  // console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401),
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ),
    );
  }

  const isPasswordRecentThanToken = currentUser.changePasswordAfter(
    decoded.iat,
  );

  if (isPasswordRecentThanToken) {
    return next(
      new AppError('User recently changed password! Please log in again!', 401),
    );
  }

  request.user = currentUser;
  next();
});

const restrictTo =
  (...roles) =>
  (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };

const authController = {
  signUp,
  login,
  protect,
  restrictTo,
};

export default authController;
