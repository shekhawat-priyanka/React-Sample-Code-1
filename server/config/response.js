module.exports = {
  successResponse: function(
    res,
    data = {},
    message = '',
    statusCode = 200,
    status = true
  ) {
    return res
      .status(statusCode)
      .json({ status: status, message: message, response: data });
  },

  errorResponse: function(
    res,
    error = '',
    message = 'Errors! Please correct the following errors and submit again.',
    statusCode = 200,
    status = false
  ) {
    res
      .status(statusCode)
      .json({ status: status, message: message, errors: error });
  }
};
