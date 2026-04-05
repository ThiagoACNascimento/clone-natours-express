import e from 'express';
import viewController from '../controllers/viewController.js';

const viewRouter = e.Router();

viewRouter.get('/', viewController.getOverview);
viewRouter.get('/tour/:slug', viewController.getTour);

export default viewRouter;
