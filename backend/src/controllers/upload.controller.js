const asyncHandler = require('../middlewares/async.middleware');
const ApiError = require('../utils/ApiError');

exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(400, 'Please upload an image file'));
  }

  const imagePath = `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    message: 'Image saved locally',
    data: {
      url: imagePath,
      filename: req.file.filename,
    },
  });
});
