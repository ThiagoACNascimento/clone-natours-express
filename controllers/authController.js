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
  const { name, email, password, passwordConfirm } = request.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
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

const authController = {
  signUp,
  login,
};

export default authController;
