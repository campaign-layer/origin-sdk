class APIError extends Error {
  statusCode: string | number;
  constructor(message: string, statusCode?: string | number) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): { error: string; message: string; statusCode?: string | number } {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode || 500,
    };
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): { error: string; message: string; statusCode: number } {
    return {
      error: this.name,
      message: this.message,
      statusCode: 400,
    };
  }
}

export { APIError, ValidationError };
