import User from '../models/userModel.js';
import catcher from '../utils/catchAsync.js';

const signUp = catcher.asyncFuction(async (request, response, next) => {
  const newUser = await User.create(request.body);

  response.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

const authController = {
  signUp,
};

export default authController;
