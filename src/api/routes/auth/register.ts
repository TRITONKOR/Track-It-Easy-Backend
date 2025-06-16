import { RegisterAction } from "@/app/actions/auth/register";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface RegisterRequest extends RequestGenericInterface {
    Body: {
        username: string;
        email: string;
        password: string;
    };
}

const registerOptions: RouteShorthandOptions = {
    schema: {
        tags: ["auth", "public"],
        description: "Registers a new user account",
        body: {
            type: "object",
            required: ["username", "email", "password"],
            properties: {
                username: { type: "string" },
                email: {
                    type: "string",
                    format: "email",
                },
                password: {
                    type: "string",
                    minLength: 6,
                },
            },
        },
        response: {
            201: {
                description: "User registered successfully",
                type: "object",
                properties: {
                    id: { type: "string", example: "a1b2c3d4" },
                    username: { type: "string", example: "john_doe" },
                    email: { type: "string", example: "john@example.com" },
                    role: { type: "string", example: "user" },
                },
            },
            400: {
                description: "Validation or business error",
                type: "object",
                properties: {
                    message: {
                        type: "string",
                        example: "Email already exists",
                    },
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

export const register = {
    url: "/auth/register",
    method: "POST" as const,
    schema: registerOptions.schema,
    handler: async (
        request: FastifyRequest<RegisterRequest>,
        reply: FastifyReply
    ) => {
        const { username, email, password } = request.body;

        const result = await new RegisterAction(
            request.server.domainContext
        ).execute(username, email, password);

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }
        return reply.code(201).send(result);
    },
};
