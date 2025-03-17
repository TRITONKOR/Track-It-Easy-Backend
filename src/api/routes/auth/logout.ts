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
        response: {
            200: {
                type: "object",
                properties: {
                    "x-auth-token": {
                        type: "string",
                        description: "Session access token",
                    },
                },
                required: ["x-auth-token"],
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
