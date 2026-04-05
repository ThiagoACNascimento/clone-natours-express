import Tour from '../models/tourModel.js';
import catcher from '../utils/catchAsync.js';

const getOverview = catcher.asyncFuction(async (request, response, next) => {
  const tours = await Tour.find();

  response.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTour = (request, response) => {
  response.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};

const viewController = {
  getOverview,
  getTour,
};

export default viewController;
