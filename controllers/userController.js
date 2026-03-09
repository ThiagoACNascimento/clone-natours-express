import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catcher from '../utils/catchAsync.js';

const getAllUsers = catcher.asyncFuction(async (request, response, next) => {
  const users = await User.find();

  response.status(200).json({
    status: 'success',
    results: users.length,
    requested: request.requestTime,
    data: {
      users,
    },
  });
});

const updateMe = catcher.asyncFuction(async (request, response, next) => {
  const { password, passwordConfirm } = request.body;
  if (password || passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates! Please use /updatePassword',
        400,
      ),
    );
  }

  const { name, email } = request.body;
  const updateFields = {};

  if (name) updateFields.name = name;
  if (email) updateFields.email = email;

  console.log(updateFields);

  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    updateFields,
    {
      new: true,
      runValidators: true,
    },
  );

  response.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

function createUser(request, response) {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}

function getUserByID(request, response) {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}

function updateUser(request, response) {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}

function deleteUser(request, response) {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}

const userController = {
  getAllUsers,
  getUserByID,
  createUser,
  updateMe,
  updateUser,
  deleteUser,
};

export default userController;
