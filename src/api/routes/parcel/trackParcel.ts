import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";
import { ParcelAlreadyExistsException } from "src/api/errors/httpException";
import { TrackParcelAction } from "src/app/actions/parcel/trackParcel";

interface TrackParcelRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
        userId?: string;
    };
}

const trackOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: "object",
            required: ["trackingNumber"],
            properties: {
                trackingNumber: { type: "string" },
                userId: { type: "string" },
            },
        },
    },
};

export const trackParcel = {
    url: "/track",
    method: "POST" as const,
    schema: trackOptions.schema,
    handler: async (
        request: FastifyRequest<TrackParcelRequest>,
        reply: FastifyReply
    ) => {
        try {
            const { trackingNumber, userId } = request.body;

            const result = await new TrackParcelAction(
                request.server.domainContext
            ).execute(trackingNumber, userId);

            if (typeof result === "string") {
                return reply.status(400).send({
                    success: false,
                    error: result,
                });
            }

            return reply.send(result);
        } catch (error) {
            if (error instanceof ParcelAlreadyExistsException) {
                return reply.status(error.statusCode).send({
                    success: false,
                    error: error.message,
                    code: error.code,
                });
            }

            console.error("Error tracking parcel:", error);
            return reply.status(500).send({
                success: false,
                error: "Internal server error",
            });
        }
    },
};
