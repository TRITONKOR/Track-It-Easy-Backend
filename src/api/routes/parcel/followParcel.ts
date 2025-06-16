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
        tags: ["parcels"],
        description:
            "Associates an existing parcel with a specific user for tracking purposes.",
        body: {
            type: "object",
            required: ["trackingNumber", "userId"],
            properties: {
                trackingNumber: {
                    type: "string",
                    description: "Tracking number of the parcel to follow",
                },
                userId: {
                    type: "string",
                    description:
                        "ID of the user who wants to follow the parcel",
                },
            },
        },
        response: {
            201: {
                description: "Parcel successfully followed by the user",
                type: "null",
            },
            400: {
                description: "Validation failed or parcel cannot be followed",
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
            500: {
                description: "Unexpected server error",
                type: "object",
                properties: {
                    message: { type: "string" },
                },
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
