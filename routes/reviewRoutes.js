import e from 'express';
import reviewController from '../controllers/reviewController.js';
import authController from '../controllers/authController.js';

const reviewRoute = e.Router({ mergeParams: true });

reviewRoute
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.create,
  )
  .get(authController.protect, reviewController.getAllReviews);

reviewRoute
  .route('/:tourId')
  .get(authController.protect, reviewController.getOneReview);

export default reviewRoute;
