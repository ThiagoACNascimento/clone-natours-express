import AppError from '../utils/appError.js';
import catcher from '../utils/catchAsync.js';

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

const factory = {
  deleteOne,
};

export default factory;
