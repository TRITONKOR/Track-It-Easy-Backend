import { FastifyError } from "fastify";

export class HttpException extends Error implements FastifyError {
    public statusCode: number;
    public code: string;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.code = `ERROR_${statusCode}`;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ParcelAlreadyExistsException extends HttpException {
    constructor() {
        super(
            409,
            "Parcel already exists. User ID is required to track an existing parcel"
        );
    }
}
