import e from 'express';
import authController from '../controllers/authController.js';
import userController from '../controllers/userController.js';

const userRouter = e.Router();

userRouter.post('/signup', authController.signUp);
userRouter.post('/login', authController.login);
userRouter.post('/forgotPassword', authController.forgotPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

userRouter.use(authController.protect);

userRouter.route('/me').get(userController.getMe, userController.getUserByID);
userRouter.route('/updatePassword').patch(authController.updatePassword);
userRouter.route('/updateMe').patch(userController.updateMe);
userRouter.route('/deleteMe').delete(userController.deleteMe);

userRouter.use(authController.restrictTo('admin'));

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
