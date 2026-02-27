import e from 'express';
import tourControllers from '../controllers/tourController.js';

const tourRouter = e.Router();

// tourRouter.param('id', tourControllers.checkID);

tourRouter
  .route('/')
  .post(tourControllers.createTour)
  .get(tourControllers.getAllTours);
tourRouter
  .route('/:id')
  .get(tourControllers.getTourByID)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

export default tourRouter;
