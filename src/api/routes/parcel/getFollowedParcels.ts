import { GetFollowedParcelsAction } from "@/app/actions/parcel/getFollowedParcels";
import { GetTrackingEventByParcelAction } from "@/app/actions/trackingEvent/getTrackingEventByParcel";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface GetFollowedParcelsRequest extends RequestGenericInterface {
    Body: {
        userId: string;
    };
}

const getFollowedParcelsOptions: RouteShorthandOptions = {
    schema: {
        tags: ["parcels"],
        summary: "Отримати всі відстежувані посилки користувача",
        description:
            "Повертає масив посилок, які користувач додав у відстежувані, разом з історією руху.",
        body: {
            type: "object",
            required: ["userId"],
            properties: {
                userId: { type: "string", description: "ID користувача" },
            },
        },
        response: {
            200: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "ID посилки" },
                        trackingNumber: {
                            type: "string",
                            description: "Трек-номер",
                        },
                        status: {
                            type: "string",
                            description: "Поточний статус посилки",
                        },
                        courier: {
                            type: "string",
                            description: "Назва кур'єра",
                        },
                        fromLocation: {
                            type: "string",
                            description: "Звідки відправлено",
                        },
                        toLocation: {
                            type: "string",
                            description: "Куди доставляється",
                        },
                        factualWeight: {
                            type: "string",
                            description: "Фактична вага",
                        },
                        createdAt: {
                            type: "string",
                            format: "date-time",
                            description: "Дата створення",
                        },
                        updatedAt: {
                            type: "string",
                            format: "date-time",
                            description: "Дата оновлення",
                        },
                        movementHistory: {
                            type: "array",
                            description: "Історія руху посилки",
                            items: {
                                type: "object",
                                properties: {
                                    statusLocation: {
                                        type: "string",
                                        description: "Локація",
                                    },
                                    description: {
                                        type: "string",
                                        description: "Опис події",
                                    },
                                    timestamp: {
                                        type: "string",
                                        format: "date-time",
                                        description: "Час події",
                                    },
                                },
                            },
                        },
                    },
                },
            },
            401: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
            404: {
                type: "object",
                properties: {
                    message: { type: "string" },
                },
            },
        },
    },
};

export const getFollowedParcels = {
    url: "/followed-parcels",
    method: "POST" as const,
    schema: getFollowedParcelsOptions.schema,
    handler: async (
        request: FastifyRequest<GetFollowedParcelsRequest>,
        reply: FastifyReply
    ) => {
        const { userId } = request.body;

        if (!userId) {
            return reply.code(401).send({ message: "Unauthorized" });
        }

        const followedParcels = await new GetFollowedParcelsAction(
            request.server.domainContext
        ).execute(userId);

        if (followedParcels) {
            const trackingEvents = await Promise.all(
                followedParcels.map((parcel) =>
                    new GetTrackingEventByParcelAction(
                        request.server.domainContext
                    ).execute(parcel)
                )
            );
            const parcelsWithTrackingEvents = followedParcels.map(
                (parcel, index) => ({
                    ...parcel,
                    movementHistory: trackingEvents[index],
                })
            );

            return reply.code(200).send(parcelsWithTrackingEvents);
        } else {
            return reply.code(404).send({ message: "No parcels found" });
        }
    },
};
