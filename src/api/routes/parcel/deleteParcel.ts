import { DeleteParcelAction } from "@/app/actions/parcel/deleteParcel";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface DeleteParcelRequest extends RequestGenericInterface {
    Params: {
        id: string;
    };
}

const deleteParcelOptions: RouteShorthandOptions = {
    schema: {
        tags: ["parcels"],
        params: {
            type: "object",
            properties: {
                id: { type: "string" },
            },
            required: ["id"],
        },
    },
};

export const deleteParcel = {
    url: "/parcels/:id",
    method: "DELETE" as const,
    schema: deleteParcelOptions.schema,
    handler: async (
        request: FastifyRequest<DeleteParcelRequest>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;

        const result = await new DeleteParcelAction(
            request.server.domainContext
        ).execute(id, "fgd");

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }
        return reply.code(201).send(result);
    },
};
