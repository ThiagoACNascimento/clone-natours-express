import e from 'express';
import tourControllers from '../controllers/tourController.js';

const tourRouter = e.Router();

// tourRouter.param('id', tourControllers.checkID);

tourRouter
  .route('/')
  .post(tourControllers.createTour)
  .get(tourControllers.getAllTours);

tourRouter
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

tourRouter.route('/stats').get(tourControllers.getTourStats);

tourRouter
  .route('/:id')
  .get(tourControllers.getTourByID)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTourByID);

export default tourRouter;
