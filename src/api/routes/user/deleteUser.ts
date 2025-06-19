import { DeleteUserAction } from "@/app/actions/user/deleteUser";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface DeleteUserRequest extends RequestGenericInterface {
    Params: {
        id: string;
    };
}

const deleteUserOptions: RouteShorthandOptions = {
    schema: {
        tags: ["users"],
        params: {
            type: "object",
            properties: {
                id: { type: "string" },
            },
            required: ["id"],
        },
    },
};

export const deleteUser = {
    url: "/users/:id",
    method: "DELETE" as const,
    schema: deleteUserOptions.schema,
    handler: async (
        request: FastifyRequest<DeleteUserRequest>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;

        const result = await new DeleteUserAction(
            request.server.domainContext
        ).execute(id, "fgd");

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }
        return reply.code(201).send(result);
    },
};
