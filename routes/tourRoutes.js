import e from 'express';
import authController from '../controllers/authController.js';
import tourControllers from '../controllers/tourController.js';
import reviewRoute from './reviewRoutes.js';

const tourRouter = e.Router();

// tourRouter.param('id', tourControllers.checkID);

tourRouter
  .route('/')
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.createTour,
  )
  .get(authController.protect, tourControllers.getAllTours);

tourRouter
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

tourRouter.route('/stats').get(tourControllers.getTourStats);

tourRouter
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourControllers.getMonthlyPlan,
  );

tourRouter
  .route('/:id')
  .get(tourControllers.getTourByID)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTourByID,
  );

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControllers.getTourWithin);

tourRouter
  .route('/distances/:latlng/unit/:unit')
  .get(tourControllers.getDistances);

tourRouter.use('/:tourId/reviews', reviewRoute);

export default tourRouter;
