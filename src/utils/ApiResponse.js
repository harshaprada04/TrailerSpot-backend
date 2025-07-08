class ApiResponse {
  constructor(res) {
    this.res = res;
  }

  success(data, message = 'Success', statusCode = 200) {
    return this.res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  error(error, message = 'Error', statusCode = 500) {
    return this.res.status(statusCode).json({
      status: 'error',
      message,
      error,
    });
  }

  notFound(message = 'Not Found') {
    return this.res.status(404).json({
      status: 'error',
      message,
    });
  }
}

export default ApiResponse;
