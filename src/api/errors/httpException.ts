export class HttpException extends Error {
    constructor(statusCode: number, message: string) {
        const validStatusCode = statusCode as
            | 200
            | 201
            | 202
            | 204
            | 301
            | 302
            | 304
            | 400
            | 401
            | 402
            | 403
            | 404
            | 500
            | 501
            | 503;

        if (!message) {
            message = HttpException.statusMessages[validStatusCode] || "Error";
        }
        super(message);
        this.name = "HttpException";
        Error.captureStackTrace(this, this.constructor);
    }

    static statusMessages = {
        200: "OK",
        201: "Created",
        202: "Accepted",
        204: "No Content",
        301: "Moved Permanently",
        302: "Found",
        304: "Not Modified",
        400: "Bad Request",
        401: "Unauthorized",
        402: "Payment Required",
        403: "Forbidden",
        404: "Not Found",
        500: "Internal Server Error",
        501: "Not Implemented",
        503: "Service Unavailable",
    };
}
