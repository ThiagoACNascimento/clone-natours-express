import e from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';

const userRouter = e.Router();

userRouter.post('/signup', authController.signUp);
userRouter.post('/login', authController.login);

userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

userRouter
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRouter
  .route('/:id')
  .get(userController.getUserByID)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default userRouter;
