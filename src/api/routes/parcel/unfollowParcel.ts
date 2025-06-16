import { UnfollowParcelAction } from "@/app/actions/parcel/unfollowParcel";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface UnfollowParcelRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
        userId: string;
    };
}

const unfollowParcelOptions: RouteShorthandOptions = {
    schema: {
        tags: ["parcels"],
        description: "Removes a parcel from the user's followed list.",
        body: {
            type: "object",
            required: ["trackingNumber", "userId"],
            properties: {
                trackingNumber: {
                    type: "string",
                    description: "Tracking number of the parcel to unfollow",
                },
                userId: {
                    type: "string",
                    description:
                        "ID of the user who wants to unfollow the parcel",
                },
            },
        },
        response: {
            201: {
                description: "Parcel successfully unfollowed",
                type: "null",
            },
            400: {
                description: "Validation error or unfollow failed",
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
