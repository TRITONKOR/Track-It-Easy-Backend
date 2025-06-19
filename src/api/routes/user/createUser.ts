import { CreateUserAction } from "@/app/actions/user/createUser";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface CreateUserRequest extends RequestGenericInterface {
    Body: {
        username: string;
        email: string;
        password: string;
        role: "admin" | "user";
    };
}

const createUserOptions: RouteShorthandOptions = {
    schema: {
        tags: ["users"],
        body: {
            type: "object",
            required: ["username", "email", "password", "role"],
            properties: {
                username: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                role: { type: "string", enum: ["admin", "user"] },
            },
        },
    },
};

export const createUser = {
    url: "/users",
    method: "POST" as const,
    schema: createUserOptions.schema,
    handler: async (
        request: FastifyRequest<CreateUserRequest>,
        reply: FastifyReply
    ) => {
        const { username, email, password, role } = request.body;

        const result = await new CreateUserAction(
            request.server.domainContext
        ).execute(username, email, password, role);

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }
        return reply.code(201).send(result);
    },
};
