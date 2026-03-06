import User from '../models/userModel.js';
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
  updateUser,
  deleteUser,
};

export default userController;
