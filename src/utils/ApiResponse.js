class ApiResponse {
  constructor(data, message = "Success", statusCode) {
    this.data = data;
    this.message = message;
    this.success = statusCode < 400
  }
}

export {ApiResponse}