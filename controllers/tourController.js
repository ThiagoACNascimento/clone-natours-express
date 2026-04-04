import Tour from '../models/tourModel.js';
import AppError from '../utils/appError.js';
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

const getTourWithin = catcher.asyncFuction(async (request, response, next) => {
  const { distance, latlng, unit } = request.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Plase provide latitude and longitude in the format lat, lng',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

const getDistances = catcher.asyncFuction(async (request, response, next) => {
  const { latlng, unit } = request.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Plase provide latitude and longitude in the format lat, lng',
        400,
      ),
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  response.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});

const tourControllers = {
  createTour,
  getAllTours,
  getTourByID,
  getTourStats,
  getMonthlyPlan,
  getTourWithin,
  getDistances,
  aliasTopTours,
  updateTour,
  deleteTourByID,
};

export default tourControllers;
