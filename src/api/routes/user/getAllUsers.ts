import { GetAllUsersAction } from "@/app/actions/user/getAllUsers";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface GetAllUsersRequest extends RequestGenericInterface {
    Body: {};
}

const getAllUsersOptions: RouteShorthandOptions = {
    schema: {
        tags: ["users"],
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        username: { type: "string" },
                        email: { type: "string" },
                        role: { type: "string" },
                    },
                },
            },
        },
    },
};

export const getAllUsers = {
    url: "/users",
    method: "GET" as const,
    schema: getAllUsersOptions.schema,
    handler: async (
        request: FastifyRequest<GetAllUsersRequest>,
        reply: FastifyReply
    ) => {
        const result = await new GetAllUsersAction(
            request.server.domainContext
        ).execute();

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }
        return reply.code(201).send(result);
    },
};
