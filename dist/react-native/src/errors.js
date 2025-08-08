'use strict';

class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "APIError";
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            error: this.name,
            message: this.message,
            statusCode: this.statusCode || 500,
        };
    }
}
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            error: this.name,
            message: this.message,
            statusCode: 400,
        };
    }
}

exports.APIError = APIError;
exports.ValidationError = ValidationError;
