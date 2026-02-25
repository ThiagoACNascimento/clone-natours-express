import fs from "fs";

const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

function checkID(request, response, next) {
  const id = request.params.id * 1;

  if (id > tours.length || id < 0) {
    return response.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  next();
}

function checkBody(request, response, next) {
  if (!request.body.name || !request.body.price) {
    return response.status(400).json({
      status: "fail",
      message: "Invalid Body",
    });
  }
  next();
}

function getAllTours(request, response) {
  console.log(request.requestTime);
  response.status(200).json({
    status: "success",
    results: tours.length,
    requested: request.requestTime,
    data: {
      tours,
    },
  });
}

function getTourByID(request, response) {
  const id = request.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  response.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
}

function createTour(request, response) {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body);

  tours.push(newTour);

  fs.writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(tours),
    (err) => {
      response.status(201).json({
        status: "success",
        data: {
          tours: newTour,
        },
      });
    },
  );
}

function updateTour(request, response) {
  const id = request.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  const { name, duration, difficulty } = request.body;

  response.status(200).json({
    status: "success",
    data: {
      name,
      duration,
      difficulty,
    },
  });
}

function deleteTour(request, response) {
  response.status(200).json({
    status: "success",
    data: null,
  });
}

const tourControllers = {
  checkID,
  checkBody,
  getAllTours,
  getTourByID,
  updateTour,
  deleteTour,
  createTour,
};

export default tourControllers;
