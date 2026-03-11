import Review from '../models/reviewModel.js';
import Tour from '../models/tourModel.js';
import catcher from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';

const create = catcher.asyncFuction(async (request, response, next) => {
  const authorId = request.user.id;
  const { tourId, review, rating } = request.body;

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

  const createdReview = await Review.create(info);

  response.status(201).json({
    status: 'success',
    data: {
      review: createdReview,
    },
  });
});

const getAllReviews = catcher.asyncFuction(async (request, response, next) => {
  const features = new APIFeatures(Review.find(), request.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const foundReviews = await features.query;

  response.status(200).json({
    status: 'success',
    results: foundReviews.length,
    requested: request.requestTime,
    data: {
      reviews: foundReviews,
    },
  });
});

const reviewController = {
  create,
  getAllReviews,
};

export default reviewController;
