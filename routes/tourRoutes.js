import e from 'express';
import authController from '../controllers/authController.js';
import tourControllers from '../controllers/tourController.js';

const tourRouter = e.Router();

// tourRouter.param('id', tourControllers.checkID);

tourRouter
  .route('/')
  .post(tourControllers.createTour)
  .get(authController.protect, tourControllers.getAllTours);

tourRouter
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

tourRouter.route('/stats').get(tourControllers.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourControllers.getMonthlyPlan);

tourRouter
  .route('/:id')
  .get(tourControllers.getTourByID)
  .patch(tourControllers.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTourByID,
  );

export default tourRouter;
