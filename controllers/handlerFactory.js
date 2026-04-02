import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catcher from '../utils/catchAsync.js';

const createOne = (Model) =>
  catcher.asyncFuction(async (request, response, next) => {
    const createdDocument = await Model.create(request.body);

    if (!createdDocument) {
      return next(new AppError('Create document fail. Try another time', 400));
    }

    response.status(201).json({
      status: 'success',
      data: {
        tours: createdDocument,
      },
    });
  });

const getOne = (Model, options) =>
  catcher.asyncFuction(async (request, response, next) => {
    const { id } = request.params;

    let query = Model.findById(id);

    if (options) {
      query = query.populate(options);
    }

    const foundDocument = await query;
    // Tour.findOne({ _id: id }); -- Same thing

    if (!foundDocument) {
      return next(new AppError('No document found with that ID', 404));
    }

    response.status(200).json({
      status: 'success',
      data: {
        foundDocument,
      },
    });
  });

const getAll = (Model) =>
  catcher.asyncFuction(async (request, response, next) => {
    let filter = {};
    if (request.params.tourId) filter = { tour: request.params.tourId };

    const features = new APIFeatures(Model.find(filter), request.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // const foundDocument = await features.query.explain();
    const foundDocument = await features.query;

    response.status(200).json({
      status: 'success',
      results: foundDocument.length,
      requested: request.requestTime,
      data: {
        foundDocument,
      },
    });
  });

const deleteOne = (Model) =>
  catcher.asyncFuction(async (request, response, next) => {
    const { id } = request.params;

    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new AppError('No document found with this ID', 404));
    }

    response.status(204).json({
      status: 'success',
      data: null,
    });
  });

const updateOne = (Model) =>
  catcher.asyncFuction(async (request, response, next) => {
    const { id } = request.params;

    const updatedDocument = await Model.findByIdAndUpdate(id, request.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedDocument) {
      return next(new AppError('No document found with that ID', 404));
    }

    response.status(200).json({
      status: 'success',
      data: {
        updatedDocument,
      },
    });
  });

const factory = {
  createOne,
  getOne,
  getAll,
  updateOne,
  deleteOne,
};

export default factory;
