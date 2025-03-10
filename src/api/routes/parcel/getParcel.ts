import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";
import { GetParcelAction } from "src/app/actions/parcel/getParcel";

interface GetParcelRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
        courier: string;
    };
}

const trackOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: "object",
            required: ["trackingNumber", "courier"],
            properties: {
                trackingNumber: { type: "string" },
                courier: { type: "string" },
            },
        },
    },
};

export const getParcel = {
    url: "/track",
    method: "POST" as const,
    schema: trackOptions.schema,
    handler: async (
        request: FastifyRequest<GetParcelRequest>,
        reply: FastifyReply
    ) => {
        const { trackingNumber, courier } = request.body;

        const result = await new GetParcelAction(
            request.server.domainContext
        ).execute(courier, trackingNumber);

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }
        return reply.code(201).send(result);
    },
};
