import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface LogoutAuthRequest extends RequestGenericInterface {
    Body: {};
}

const refreshAuthOptions: RouteShorthandOptions = {
    schema: {
        tags: ["auth", "public"],
        description: "Refreshes the session and returns a new access token",
        response: {
            200: {
                description: "Successful token refresh",
                type: "object",
                properties: {
                    "x-auth-token": {
                        type: "string",
                        description: "Session access token",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                    },
                },
                required: ["x-auth-token"],
            },
            401: {
                description: "Invalid or missing refresh token",
                type: "object",
                properties: {
                    message: { type: "string", example: "Unauthorized" },
                },
            },
            500: {
                description: "Unexpected server error",
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Internal server error",
                    },
                },
            },
        },
    },
};

export const logout = {
    url: "/auth/logout",
    method: "POST" as const,
    schema: refreshAuthOptions.schema,
    handler: async (
        request: FastifyRequest<LogoutAuthRequest>,
        reply: FastifyReply
    ) => {
        return reply
            .clearCookie("x-session")
            .code(200)
            .send({ "x-auth-token": "" });
    },
};
