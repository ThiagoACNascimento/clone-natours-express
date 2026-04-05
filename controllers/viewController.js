import Tour from '../models/tourModel.js';
import catcher from '../utils/catchAsync.js';

const getOverview = catcher.asyncFuction(async (request, response, next) => {
  const tours = await Tour.find();

  response.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTour = catcher.asyncFuction(async (request, response) => {
  const { slug } = request.params;
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating author',
  });

  response.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});

const viewController = {
  getOverview,
  getTour,
};

export default viewController;
