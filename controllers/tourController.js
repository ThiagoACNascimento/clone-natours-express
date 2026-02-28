import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';

async function createTour(request, response) {
  // const newTour = new Tour({});
  // newTour.save();

  try {
    const createdTour = await Tour.create(request.body);

    response.status(201).json({
      status: 'success',
      data: {
        tours: createdTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
}

async function getAllTours(request, response) {
  try {
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
  } catch (error) {
    response.status(200).json({
      status: 'fail',
      message: error.message,
    });
  }
}

async function getTourByID(request, response) {
  try {
    const { id } = request.params;
    const foundTour = await Tour.findById(id);
    // Tour.findOne({ _id: id }); -- Same thing

    response.status(200).json({
      status: 'success',
      data: {
        foundTour,
      },
    });
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
}

function aliasTopTours(request, response, next) {
  request.query.limit = '5';
  request.query.sort = '-ratingsAverage,price';
  request.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

async function updateTour(request, response) {
  try {
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
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
}

async function deleteTourByID(request, response) {
  try {
    const { id } = request.params;

    await Tour.findByIdAndDelete(id);

    response.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
}

async function getTourStats(request, response) {
  try {
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
  } catch (error) {
    response.status(404).json({
      sttaus: 'fail',
      message: error,
    });
  }
}

const tourControllers = {
  createTour,
  getAllTours,
  getTourByID,
  getTourStats,
  aliasTopTours,
  updateTour,
  deleteTourByID,
};

export default tourControllers;
