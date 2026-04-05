import e from 'express';
import viewController from '../controllers/viewController.js';

const viewRouter = e.Router();

viewRouter.get('/', viewController.getOverview);
viewRouter.get('/tour', viewController.getTour);

export default viewRouter;
