import { UnfollowParcelAction } from "@/app/actions/parcel/unfollowParcel";
import { apiKeyAuth } from "@/middleware/apiKeyMiddleware";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface UnfollowParcelApiKeyRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
    };
}

const unfollowParcelApiKeyOptions: RouteShorthandOptions = {
    schema: {
        tags: ["parcels", "api-key"],
        description: "Unfollow a parcel using API key.",
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

export const unfollowParcelApiKey = {
    url: "/api/v1/unfollow-parcel",
    method: "POST" as const,
    schema: unfollowParcelApiKeyOptions.schema,
    preHandler: unfollowParcelApiKeyOptions.preHandler,
    handler: async (
        request: FastifyRequest<UnfollowParcelApiKeyRequest>,
        reply: FastifyReply
    ) => {
        const { trackingNumber } = request.body;
        const apiKey = request.headers["x-api-key"] as string;
        const user = await request.server.domainContext.userRepository.findByApiKey(apiKey);
        if (!user) return reply.status(401).send({ message: "Invalid API key" });
        await new UnfollowParcelAction(request.server.domainContext).execute(trackingNumber, user.id);
        return reply.code(201).send();
    },
};
