import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";
import { RefreshAction } from "../../../app/actions/auth/refresh";
import { HttpException } from "../../errors/httpException";

interface RefreshAuthRequest extends RequestGenericInterface {
    Body: {};
}

const refreshAuthOptions: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: "object",
                properties: {
                    accessToken: {
                        type: "string",
                        description: "New access token",
                    },
                    user: {
                        type: "object",
                        properties: {
                            id: { type: "string", description: "User ID" },
                            username: {
                                type: "string",
                                description: "Username of the user",
                            },
                            userRole: {
                                type: "string",
                                description: "Indicates user role",
                            },
                        },
                        required: ["id", "username", "userRole"],
                    },
                },
                required: ["accessToken", "user"],
            },
            401: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description: "Error message if session is invalid",
                    },
                },
            },
            500: {
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        description:
                            "Error message if something went wrong during the refresh",
                    },
                },
            },
        },
    },
};

export const refreshAuth = {
    url: "/auth/refresh",
    method: "PATCH" as const,
    schema: refreshAuthOptions.schema,
    handler: async (
        request: FastifyRequest<RefreshAuthRequest>,
        reply: FastifyReply
    ) => {
        const _refreshToken = request.cookies["x-session"];

        if (!_refreshToken) {
            throw new HttpException(401, "Invalid session");
        }

        try {
            const { accessToken, refreshToken, user } = await new RefreshAction(
                request.server.domainContext
            ).execute(
                _refreshToken,

                request.server.requestContext.get("sessionData")
            );

            return reply
                .setCookie("x-session", refreshToken, {
                    maxAge: 3600 * 24 * 7,
                    signed: true,
                    secure: true,
                    httpOnly: true,
                    path: "/",
                })
                .code(200)
                .send({ accessToken, user });
        } catch (error) {
            console.error("Error during token refresh:", error);
            return reply
                .code(500)
                .send({ message: "An error occurred during token refresh" });
        }
    },
};
