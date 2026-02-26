function getAllUsers(request, response) {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
}

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
