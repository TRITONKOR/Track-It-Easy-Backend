import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

import { HttpException } from "@/api/errors/httpException";
import { LoginAction } from "@/app/actions/auth/login";

interface LoginRequest extends RequestGenericInterface {
    Body: {
        email: string;
        password: string;
    };
}

const loginOptions: RouteShorthandOptions = {
    schema: {
        tags: ["auth"],
        body: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" },
            },
        },
        response: {
            201: {
                type: "object",
                properties: {
                    accessToken: { type: "string" },
                    user: {
                        type: "object",
                        properties: {
                            id: { type: "string" },
                            username: { type: "string" },
                            email: { type: "string" },
                            role: { type: "string" },
                            createdAt: { type: "string", format: "date-time" },
                            updatedAt: { type: "string", format: "date-time" },
                            apiKey: { type: ["string", "null"] },
                        },
                    },
                },
                required: ["accessToken", "user"],
            },
            400: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
            500: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
};

export const login = {
    url: "/auth/login",
    method: "POST" as const,
    schema: loginOptions.schema,
    handler: async (
        request: FastifyRequest<LoginRequest>,
        reply: FastifyReply
    ) => {
        const { email, password } = request.body;

        try {
            const result = await new LoginAction(
                request.server.domainContext
            ).execute(email, password);

            if (typeof result === "string") {
                return reply.code(400).send({ message: result });
            }

            const { accessToken, refreshToken, user } = result;

            return reply
                .setCookie("x-session", refreshToken, {
                    maxAge: 3600 * 24 * 7,
                    secure: false,
                    httpOnly: true,
                    priority: "high",
                    sameSite: "lax",
                    path: "/",
                })
                .code(201)
                .send({ accessToken, user });
        } catch (error) {
            console.error("Error during sign-in:", error);

            if (error instanceof HttpException) {
                return reply
                    .code(error.statusCode)
                    .send({ message: error.message });
            }

            return reply.code(500).send({ message: "Error during sign-in" });
        }
    },
};
