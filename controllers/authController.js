import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catcher from '../utils/catchAsync.js';
import natoursEmail from '../utils/email.js';

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function createSendToken(user, statusCode, response, isReturnUser) {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  };

  response.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  if (isReturnUser)
    return response.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });

  response.status(statusCode).json({
    status: 'success',
    token,
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

  createSendToken(newUser, 201, response, true);
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

  createSendToken(user, 201, response, false);
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

const forgotPassword = catcher.asyncFuction(async (request, response, next) => {
  const { email } = request.body;

  const foundUser = await User.findOne({ email });

  if (foundUser) {
    const resetToken = foundUser.createPasswordResetToken();
    await foundUser.save({ validateBeforeSave: false });

    const resetURL = `${request.protocol}://${request.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    // IMPORTANT: In the future, use BULLMQ + Redis to bypass timing attacks
    try {
      await natoursEmail.send({
        email: foundUser.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });
    } catch (error) {
      foundUser.passwordResetToken = undefined;
      foundUser.passwordResetExpires = undefined;
      await foundUser.save({ validateBeforeSave: false });
      return next(
        new AppError(
          'There was an error sending the email. Try again later!',
          500,
        ),
      );
    }
  }

  response.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  });
});

const resetPassword = catcher.asyncFuction(async (request, response, next) => {
  const { token } = request.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const foundUser = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!foundUser) {
    return next(new AppError('Token is invalid or expired', 400));
  }

  const newPassword = request.body.password;
  const newPasswordConfirm = request.body.passwordConfirm;

  foundUser.password = newPassword;
  foundUser.passwordConfirm = newPasswordConfirm;
  foundUser.passwordResetToken = undefined;
  foundUser.passwordResetExpires = undefined;

  await foundUser.save();

  createSendToken(foundUser, 200, response, false);
});

const updatePassword = catcher.asyncFuction(async (request, response, next) => {
  const user = await User.findById(request.user.id).select('+password');
  const { password } = request.body;
  const isPasswordCorrect = await user.correctPassword(password, user.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Your current password is wrong', 401));
  }

  const { newPassword, newPasswordConfirm } = request.body;

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  createSendToken(user, 200, response, false);
});

const authController = {
  signUp,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};

export default authController;
