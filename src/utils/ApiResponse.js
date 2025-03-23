class ApiResponse {
  constructor(data, message = "Success", statusCode) {
    this.success = statusCode < 400
    this.data = data;
    this.message = message;
  }
}

export {ApiResponse}