import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";
import { TrackParcelAction } from "src/app/actions/parcel/trackParcel";

interface GetParcelRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
    };
}

const trackOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: "object",
            required: ["trackingNumber"],
            properties: {
                trackingNumber: { type: "string" },
            },
        },
    },
};

export const trackParcel = {
    url: "/track",
    method: "POST" as const,
    schema: trackOptions.schema,
    handler: async (
        request: FastifyRequest<GetParcelRequest>,
        reply: FastifyReply
    ) => {
        const { trackingNumber } = request.body;

        const result = await new TrackParcelAction(
            request.server.domainContext
        ).execute(trackingNumber);

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }
        return reply.code(201).send(result);
    },
};
