import { TrackParcelAction } from "@/app/actions/parcel/trackParcel";
import { apiKeyAuth } from "@/middleware/apiKeyMiddleware";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface TrackParcelApiKeyRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
    };
}

const trackApiKeyOptions: RouteShorthandOptions = {
    schema: {
        tags: ["tracking", "api-key"],
        description: "Tracks a parcel by its tracking number using API key.",
        body: {
            type: "object",
            required: ["trackingNumber"],
            properties: {
                trackingNumber: { type: "string" },
            },
        },
        response: {
            401: {
                type: "object",
                properties: { message: { type: "string" } },
            },
        },
    },
    preHandler: apiKeyAuth,
};

export const trackParcelApiKey = {
    url: "/api/v1/track",
    method: "POST" as const,
    schema: trackApiKeyOptions.schema,
    preHandler: trackApiKeyOptions.preHandler,
    handler: async (
        request: FastifyRequest<TrackParcelApiKeyRequest>,
        reply: FastifyReply
    ) => {
        const { trackingNumber } = request.body;
        const apiKey = request.headers["x-api-key"] as string;
        const user =
            await request.server.domainContext.userRepository.findByApiKey(
                apiKey
            );
        if (!user)
            return reply.status(401).send({ message: "Invalid API key" });
        const result = await new TrackParcelAction(
            request.server.domainContext
        ).execute(trackingNumber, user.id);
        return reply.code(200).send(result);
    },
};
