import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";
import { UnfollowParcelAction } from "src/app/actions/parcel/unfollowParcel";

interface UnfollowParcelRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
        userId: string;
    };
}

const unfollowParcelOptions: RouteShorthandOptions = {
    schema: {
        body: {
            type: "object",
            required: ["trackingNumber", "userId"],
            properties: {
                trackingNumber: { type: "string" },
                userId: { type: "string" },
            },
        },
    },
};

export const unfollowParcel = {
    url: "/unfollow-parcel",
    method: "POST" as const,
    schema: unfollowParcelOptions.schema,
    handler: async (
        request: FastifyRequest<UnfollowParcelRequest>,
        reply: FastifyReply
    ) => {
        const { trackingNumber, userId } = request.body;

        const result = await new UnfollowParcelAction(
            request.server.domainContext
        ).execute(trackingNumber, userId);

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }

        return reply.code(201).send();
    },
};
