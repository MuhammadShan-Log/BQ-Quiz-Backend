// middlewares/apiResponse.js
module.exports = (req, res, next) => {
  res.apiSuccess = (message, data, status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  };

  res.apiError = (message, error = null, status = 500) => {
    return res.status(status).json({
      success: false,
      message,
      error
    });
  };

  next();
};
