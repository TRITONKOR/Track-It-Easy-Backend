import { ParcelAlreadyExistsException } from "@/api/errors/httpException";
import { TrackParcelAction } from "@/app/actions/parcel/trackParcel";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface TrackParcelRequest extends RequestGenericInterface {
    Body: {
        trackingNumber: string;
        userId?: string;
    };
}

const trackOptions: RouteShorthandOptions = {
    schema: {
        tags: ["tracking"],
        description:
            "Tracks a parcel by its tracking number. Optionally associates it with a user.",
        body: {
            type: "object",
            required: ["trackingNumber"],
            properties: {
                trackingNumber: {
                    type: "string",
                    description:
                        "Parcel tracking number (e.g., from a courier)",
                },
                userId: {
                    type: "string",
                    description:
                        "Optional user ID to associate the parcel with",
                },
            },
        },
        response: {
            200: {
                description: "Parcel tracking information",
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    data: {
                        type: "object",
                        properties: {
                            trackingNumber: { type: "string" },
                            status: { type: "string" },
                            courier: { type: "string" },
                            factualWeight: { type: "string" },
                            fromLocation: { type: "string" },
                            toLocation: { type: "string" },
                            isFollowed: { type: "boolean" },
                            movementHistory: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        statusLocation: { type: "string" },
                                        description: { type: "string" },
                                        timestamp: {
                                            type: "string",
                                            format: "date-time",
                                        },
                                    },
                                    required: [
                                        "statusLocation",
                                        "description",
                                        "timestamp",
                                    ],
                                },
                            },
                            lastUpdated: {
                                type: "string",
                                format: "date-time",
                            },
                        },
                    },
                },
                required: ["success", "data"],
            },
            400: {
                description: "Invalid input or failed request",
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    error: { type: "string" },
                },
            },
            409: {
                description: "Parcel already exists (conflict)",
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    error: { type: "string" },
                    code: { type: "string" },
                },
            },
            500: {
                description: "Unexpected server error",
                type: "object",
                properties: {
                    success: { type: "boolean" },
                    error: { type: "string" },
                },
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
            console.error("Error in trackParcel handler:", error);
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
