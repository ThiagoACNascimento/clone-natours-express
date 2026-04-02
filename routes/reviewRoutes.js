import e from 'express';
import reviewController from '../controllers/reviewController.js';
import authController from '../controllers/authController.js';

const reviewRoute = e.Router({ mergeParams: true });

reviewRoute.use(authController.protect);

reviewRoute
  .route('/')
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.create,
  )
  .get(reviewController.getAllReviews);

reviewRoute
  .route('/:id')
  .get(reviewController.getOneById)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

export default reviewRoute;
