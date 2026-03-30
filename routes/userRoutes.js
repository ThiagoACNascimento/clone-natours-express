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
  .route('/deleteMe')
  .delete(authController.protect, userController.deleteMe);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    userController.createUser,
  );
userRouter
  .route('/:id')
  .get(userController.getUserByID)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userController.updateUser,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    userController.deleteUser,
  );

export default userRouter;
