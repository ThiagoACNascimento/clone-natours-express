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
  const foundTour = await Tour.find();

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
    // Tour.findOne({ _id: id });

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

function updateTour(request, response) {
  const { name, duration, difficulty } = request.body;

  response.status(200).json({
    status: 'success',
    data: {
      name,
      duration,
      difficulty,
    },
  });
}

function deleteTour(request, response) {
  response.status(200).json({
    status: 'success',
    data: null,
  });
}

const tourControllers = {
  getAllTours,
  getTourByID,
  updateTour,
  deleteTour,
  createTour,
};

export default tourControllers;
