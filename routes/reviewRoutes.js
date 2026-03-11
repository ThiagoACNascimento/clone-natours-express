import e from 'express';
import reviewController from '../controllers/reviewController.js';
import authController from '../controllers/authController.js';

const reviewRoute = e.Router();

reviewRoute
  .route('/')
  .post(authController.protect, reviewController.create)
  .get(authController.protect, reviewController.getAllReviews);

export default reviewRoute;
