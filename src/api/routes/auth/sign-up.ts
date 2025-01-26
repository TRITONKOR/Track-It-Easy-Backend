import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";
import { SignUpAction } from "src/app/actions/auth/sign-up";

interface SignUpRequest extends RequestGenericInterface {
    Body: {
        name: string;
        email: string;
        password: string;
    };
}

const signUpOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: "object",
            required: ["name", "email", "password"],
            properties: {
                name: { type: "string" },
                email: { type: "string", format: "email" },
                password: { type: "string", minLength: 6 },
            },
        },
    },
};

export const signUp = {
    url: "/auth/sign-up",
    method: "POST" as const,
    schema: signUpOptions.schema,
    handler: async (
        request: FastifyRequest<SignUpRequest>,
        reply: FastifyReply
    ) => {
        const { name, email, password } = request.body;

        const result = await new SignUpAction(
            request.server.domainContext
        ).execute(name, email, password);

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }
        return reply.code(201).send(result);
    },
};
