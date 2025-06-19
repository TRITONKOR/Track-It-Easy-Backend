import { FollowParcelAction } from "@/app/actions/parcel/followParcel";
import { apiKeyAuth } from "@/middleware/apiKeyMiddleware";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface FollowParcelApiKeyRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
    };
}

const followParcelApiKeyOptions: RouteShorthandOptions = {
    schema: {
        tags: ["parcels", "api-key"],
        description: "Follow a parcel using API key.",
        body: {
            type: "object",
            required: ["trackingNumber"],
            properties: {
                trackingNumber: { type: "string" },
            },
        },
        response: {
            201: { type: "null" },
            401: {
                type: "object",
                properties: { message: { type: "string" } },
            },
        },
    },
    preHandler: apiKeyAuth,
};

export const followParcelApiKey = {
    url: "/api/v1/follow-parcel",
    method: "POST" as const,
    schema: followParcelApiKeyOptions.schema,
    preHandler: followParcelApiKeyOptions.preHandler,
    handler: async (
        request: FastifyRequest<FollowParcelApiKeyRequest>,
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
        await new FollowParcelAction(request.server.domainContext).execute(
            trackingNumber,
            user.id
        );
        return reply.code(201).send();
    },
};
