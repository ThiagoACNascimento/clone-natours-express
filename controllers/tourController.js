import Tour from '../models/tourModel.js';
import catcher from '../utils/catchAsync.js';
import factory from './handlerFactory.js';

const createTour = factory.createOne(Tour);

const getAllTours = factory.getAll(Tour);

const getTourByID = factory.getOne(Tour, { path: 'reviews' });

function aliasTopTours(request, response, next) {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

const updateTour = factory.updateOne(Tour);

const deleteTourByID = factory.deleteOne(Tour);

const getTourStats = catcher.asyncFuction(async (request, response, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  response.status(200).json({
    sttaus: 'success',
    data: {
      stats,
    },
  });
});

const getMonthlyPlan = catcher.asyncFuction(async (request, response, next) => {
  const { year } = request.params;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  response.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

const tourControllers = {
  createTour,
  getAllTours,
  getTourByID,
  getTourStats,
  getMonthlyPlan,
  aliasTopTours,
  updateTour,
  deleteTourByID,
};

export default tourControllers;
