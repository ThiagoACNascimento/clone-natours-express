import Tour from '../models/tourModel.js';

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
    const queryObject = { ...request.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    excludedFields.forEach((element) => delete queryObject[element]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    const queryStringParsed = JSON.parse(queryString);

    let query = Tour.find(queryStringParsed);

    if (request.query.sort) {
      const sortBy = request.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    if (request.query.fields) {
      const fieldBy = `${request.query.fields.split(',').join(' ')} -__v`;
      query = query.select(fieldBy);
    } else {
      query = query.select('-__v');
    }

    const page = Number(request.query.page) || 1;
    const limitBy = Number(request.query.limit) || 100;
    const skipBy = (page - 1) * limitBy;
    const numberOfTours = await Tour.countDocuments();

    if (skipBy >= numberOfTours) {
      throw new Error('This page not exist');
    }

    query = query.skip(skipBy).limit(limitBy);

    const foundTour = await query;

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

const tourControllers = {
  getAllTours,
  getTourByID,
  updateTour,
  deleteTourByID,
  createTour,
};

export default tourControllers;
