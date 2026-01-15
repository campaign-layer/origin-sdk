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

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): { error: string; message: string; statusCode: number } {
    return {
      error: this.name,
      message: this.message,
      statusCode: 401,
    };
  }
}

class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
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

class ContractError extends Error {
  contractName?: string;
  methodName?: string;

  constructor(
    message: string,
    options?: { contractName?: string; methodName?: string }
  ) {
    super(message);
    this.name = "ContractError";
    this.contractName = options?.contractName;
    this.methodName = options?.methodName;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): {
    error: string;
    message: string;
    statusCode: number;
    contractName?: string;
    methodName?: string;
  } {
    return {
      error: this.name,
      message: this.message,
      statusCode: 400,
      contractName: this.contractName,
      methodName: this.methodName,
    };
  }
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export {
  APIError,
  ValidationError,
  AuthenticationError,
  WalletError,
  ContractError,
  getErrorMessage,
};
