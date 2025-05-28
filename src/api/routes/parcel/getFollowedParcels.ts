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
        body: {
            type: "object",
            required: ["userId"],
            properties: {
                userId: { type: "string" },
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
