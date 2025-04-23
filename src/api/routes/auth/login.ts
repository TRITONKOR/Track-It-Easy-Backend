import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

import { LoginAction } from "src/app/actions/auth/login";

interface LoginRequest extends RequestGenericInterface {
    Body: {
        email: string;
        password: string;
    };
}

const loginOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" },
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

            return reply
                .code(400)
                .send({ message: "Invalid email or password" });
        }
    },
};
