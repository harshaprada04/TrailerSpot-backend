class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; 
        this.data=null; 
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;