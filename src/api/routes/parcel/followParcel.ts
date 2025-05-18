import { FollowParcelAction } from "@/app/actions/parcel/followParcel";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface FollowParcelRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
        userId: string;
    };
}

const followParcelOptions: RouteShorthandOptions = {
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

export const followParcel = {
    url: "/follow-parcel",
    method: "POST" as const,
    schema: followParcelOptions.schema,
    handler: async (
        request: FastifyRequest<FollowParcelRequest>,
        reply: FastifyReply
    ) => {
        const { trackingNumber, userId } = request.body;

        const result = await new FollowParcelAction(
            request.server.domainContext
        ).execute(trackingNumber, userId);

        if (typeof result === "string") {
            return reply.code(400).send({ message: result });
        }

        return reply.code(201).send();
    },
};
