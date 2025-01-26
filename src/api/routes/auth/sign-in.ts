import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

import { SignInAction } from "src/app/actions/auth/sign-in";

interface SignInRequest extends RequestGenericInterface {
    Body: {
        email: string;
        password: string;
    };
}

const signInOptions: RouteShorthandOptions = {
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

export const signIn = {
    url: "/auth/sign-in",
    method: "POST" as const,
    schema: signInOptions.schema,
    handler: async (
        request: FastifyRequest<SignInRequest>,
        reply: FastifyReply
    ) => {
        const { email, password } = request.body;

        try {
            const result = await new SignInAction(
                request.server.domainContext
            ).execute(email, password);

            if (typeof result === "string") {
                return reply.code(400).send({ message: result });
            }

            const { accessToken, refreshToken, user } = result;

            return reply
                .setCookie("x-session", refreshToken, { maxAge: 3600 * 24 * 7 })
                .code(201)
                .send({ accessToken, user });
        } catch (error) {
            console.error("Error during sign-in:", error);

            return reply
                .code(400)
                .send({ message: "Invalid username or password" });
        }
    },
};
