class ApiResponse {
  //
  // @param {number} statusCode
  // @param {any}    data
  // @param {string} message
  //
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }
}

module.exports = ApiResponse;
