exports.success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({ success: true, message, data });
};

exports.error = (res, message = 'An error occurred', errors = null, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message, errors });
};