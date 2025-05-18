import { GetAllParcelsAction } from "@/app/actions/parcel/getAllParcels";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface GetAllParcelsRequest extends RequestGenericInterface {
    Body: {
        userId: string;
    };
}

const getAllParcelsOptions: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string" },
                        trackingNumber: { type: "string" },
                        status: { type: "string" },
                        fromLocation: { type: "string" },
                        toLocation: { type: "string" },
                        factualWeight: { type: "string" },
                        createdAt: { type: "string" },
                        updatedAt: { type: "string" },
                    },
                },
            },
            404: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
};

export const getAllParcels = {
    url: "/parcels",
    method: "POST" as const,
    schema: getAllParcelsOptions.schema,
    handler: async (
        request: FastifyRequest<GetAllParcelsRequest>,
        reply: FastifyReply
    ) => {
        const parcels = await new GetAllParcelsAction(
            request.server.domainContext
        ).execute();

        if (parcels) {
            return reply.code(200).send(
                parcels.map((parcel) => ({
                    id: parcel.id,
                    trackingNumber: parcel.trackingNumber,
                    status: parcel.status,
                    fromLocation: parcel.fromLocation,
                    toLocation: parcel.toLocation,
                    factualWeight: parcel.factualWeight,
                    createdAt: parcel.createdAt.toISOString(),
                    updatedAt: parcel.updatedAt.toISOString(),
                }))
            );
        } else {
            return reply.code(404).send({ message: "No parcels found" });
        }
    },
};
