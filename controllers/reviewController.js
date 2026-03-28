import Review from '../models/reviewModel.js';
import Tour from '../models/tourModel.js';
import catcher from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIFeatures from '../utils/apiFeatures.js';
import factory from './handlerFactory.js';

const create = catcher.asyncFuction(async (request, response, next) => {
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

const getOneReview = catcher.asyncFuction(async (request, response, next) => {
  const { tourId } = request.params;

  const isFoundReview = await Review.findById({ tour: tourId });

  if (!isFoundReview) {
    return next(
      new AppError('No reviews found for this tour. Try another tour.', 404),
    );
  }
});

const deleteReview = factory.deleteOne(Review);

const reviewController = {
  create,
  getAllReviews,
  getOneReview,
  deleteReview,
};

export default reviewController;
