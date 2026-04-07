const successResponse = (c, data, message = 'Success', status = 200) => {
  return c.json({
    success: true,
    message,
    data,
  }, status);
};

const errorResponse = (c, message = 'Error', status = 400, details = null) => {
  return c.json({
    success: false,
    message,
    details,
    status,
  }, status);
};

module.exports = {
  successResponse,
  errorResponse,
};
