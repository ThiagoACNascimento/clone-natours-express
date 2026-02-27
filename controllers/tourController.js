import Tour from '../models/tourModel.js';

async function createTour(request, response) {
  // const newTour = new Tour({});
  // newTour.save();

  try {
    const newTour = await Tour.create(request.body);

    response.status(201).json({
      status: 'success',
      data: {
        tours: newTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
}

function getAllTours(request, response) {
  response.status(200).json({
    status: 'success',
    results: tours.length,
    requested: request.requestTime,
    data: {
      tours,
    },
  });
}

function getTourByID(request, response) {
  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
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
