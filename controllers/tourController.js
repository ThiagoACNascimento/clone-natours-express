import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catcher from '../utils/catchAsync.js';
import factory from './handlerFactory.js';

const createTour = factory.createOne(Tour);

const getAllTours = catcher.asyncFuction(async (request, response, next) => {
  const features = new APIFeatures(Tour.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const foundTour = await features.query;

  response.status(200).json({
    status: 'success',
    results: foundTour.length,
    requested: request.requestTime,
    data: {
      foundTour,
    },
  });
});

const getTourByID = catcher.asyncFuction(async (request, response, next) => {
  const { id } = request.params;
  const foundTour = await Tour.findById(id).populate('reviews');
  // Tour.findOne({ _id: id }); -- Same thing

  if (!foundTour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  response.status(200).json({
    status: 'success',
    data: {
      foundTour,
    },
  });
});

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
