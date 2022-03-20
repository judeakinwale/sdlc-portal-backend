class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ErrorResponseJSON {
  constructor(res, message, statusCode) {
    return res.status(statusCode).json({
      success: false,
      message: message
    })
  }
}

module.exports = {ErrorResponse, ErrorResponseJSON};
