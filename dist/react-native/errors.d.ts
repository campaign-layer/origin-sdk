declare class APIError extends Error {
    statusCode: string | number;
    constructor(message: string, statusCode?: string | number);
    toJSON(): {
        error: string;
        message: string;
        statusCode?: string | number;
    };
}
declare class ValidationError extends Error {
    constructor(message: string);
    toJSON(): {
        error: string;
        message: string;
        statusCode: number;
    };
}
export { APIError, ValidationError };
