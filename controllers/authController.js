import User from '../models/userModel.js';
import catcher from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';

const signUp = catcher.asyncFuction(async (request, response, next) => {
  const { name, email, password, passwordConfirm } = request.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  response.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const authController = {
  signUp,
};

export default authController;
