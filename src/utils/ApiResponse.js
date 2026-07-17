class ApiResponse {
  constructor(statusCode, data = null, message = 'Success', meta = undefined) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  static send(res, statusCode, data, message, meta) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message, meta));
  }
}

module.exports = ApiResponse;
