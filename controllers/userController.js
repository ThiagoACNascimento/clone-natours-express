import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catcher from '../utils/catchAsync.js';
import factory from './handlerFactory.js';

const getAllUsers = factory.getAll(User);

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

const createUser = factory.createOne(User);

const getUserByID = factory.getOne(User);

const updateUser = factory.updateOne(User);

const deleteMe = catcher.asyncFuction(async (request, response, next) => {
  await User.findByIdAndUpdate(request.user.id, { active: false });

  response.status(204).json({
    status: 'success',
    data: null,
  });
});

const deleteUser = factory.deleteOne(User);

const userController = {
  getAllUsers,
  getUserByID,
  createUser,
  updateMe,
  updateUser,
  deleteMe,
  deleteUser,
};

export default userController;
