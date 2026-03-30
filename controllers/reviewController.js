import Review from '../models/reviewModel.js';
import Tour from '../models/tourModel.js';
import catcher from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import factory from './handlerFactory.js';

const setTourUserIds = catcher.asyncFuction(async (request, response, next) => {
  const authorId = request.user.id;
  const { tourId: bodyTourId, review, rating } = request.body;
  const tourId = bodyTourId || request.params.tourId;

  const foundTour = await Tour.findById(tourId);

  if (!foundTour) {
    return next(
      new AppError('Tour not found. Please provide an existing tour.'),
    );
  }

  const info = {
    review,
    rating,
    author: authorId,
    tour: foundTour,
  };

  request.body = info;
  next();
});

const create = factory.createOne(Review);

const getAllReviews = factory.getAll(Review);

const getOneById = factory.getOne(Review);

const updateReview = factory.updateOne(Review);

const deleteReview = factory.deleteOne(Review);

const reviewController = {
  setTourUserIds,
  create,
  getAllReviews,
  getOneById,
  updateReview,
  deleteReview,
};

export default reviewController;
