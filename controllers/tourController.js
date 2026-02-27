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
  const queryObject = { ...request.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];

  excludedFields.forEach((element) => delete queryObject[element]);

  let queryString = JSON.stringify(queryObject);
  queryString = queryString.replace(
    /\b(gte|gt|lte|lt)\b/g,
    (match) => `$${match}`,
  );
  const queryStringParsed = JSON.parse(queryString);

  const query = Tour.find(queryStringParsed);
  const foundTour = await query;

  if (foundTour.length <= 0) {
    return response.status(404).json({
      status: 'fail',
      message: 'Tours not found',
    });
  }

  response.status(200).json({
    status: 'success',
    results: foundTour.length,
    requested: request.requestTime,
    data: {
      foundTour,
    },
  });
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
