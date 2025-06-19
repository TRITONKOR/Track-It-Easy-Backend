import { UpdateUserAction } from "@/app/actions/user/updateUser";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface UpdateUserRequest extends RequestGenericInterface {
    Params: {
        id: string;
    };
    Body: {
        username?: string;
        email?: string;
        role: "admin" | "user";
    };
}

const updateUserOptions: RouteShorthandOptions = {
    schema: {
        tags: ["users"],
        params: {
            type: "object",
            properties: {
                id: { type: "string" },
            },
            required: ["id"],
        },
        body: {
            type: "object",
            properties: {
                username: { type: "string" },
                email: { type: "string" },
                role: { type: "string", enum: ["admin", "user"] },
            },
            additionalProperties: false,
        },
    },
};

export const updateUser = {
    url: "/users/:id",
    method: "PATCH" as const,
    schema: updateUserOptions.schema,
    handler: async (
        request: FastifyRequest<UpdateUserRequest>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const { username, email, role } = request.body;

        const result = await new UpdateUserAction(
            request.server.domainContext
        ).execute(id, { username, email, role });

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }
        return reply.code(201).send(result);
    },
};
