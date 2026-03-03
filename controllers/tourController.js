import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import catcher from '../utils/catchAsync.js';

const createTour = catcher.asyncFuction(async (request, response, next) => {
  const createdTour = await Tour.create(request.body);

  response.status(201).json({
    status: 'success',
    data: {
      tours: createdTour,
    },
  });
});

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
  const foundTour = await Tour.findById(id);
  // Tour.findOne({ _id: id }); -- Same thing

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

const updateTour = catcher.asyncFuction(async (request, response, next) => {
  const { id } = request.params;

  const updatedTour = await Tour.findByIdAndUpdate(id, request.body, {
    new: true,
    runValidators: true,
  });
  response.status(200).json({
    status: 'success',
    data: {
      updatedTour,
    },
  });
});

const deleteTourByID = catcher.asyncFuction(async (request, response, next) => {
  const { id } = request.params;

  await Tour.findByIdAndDelete(id);

  response.status(204).json({
    status: 'success',
    data: null,
  });
});

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
