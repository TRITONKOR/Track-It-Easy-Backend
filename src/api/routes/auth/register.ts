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
        body: {
            type: "object",
            required: ["username", "email", "password"],
            properties: {
                username: { type: "string" },
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 6 },
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
