class ApiResponse {
  constructor(res) {
    this.res = res;
  }

  success(data, message = 'Success') {
    return this.res.status(200).json({
      status: 'success',
      message,
      data,
    });
  }

  error(error, message = 'Error') {
    return this.res.status(500).json({
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