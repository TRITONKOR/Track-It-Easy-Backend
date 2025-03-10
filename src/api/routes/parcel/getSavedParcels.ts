import { FastifyReply, FastifyRequest } from "fastify";
import { GetSavedParcelsAction } from "src/app/actions/parcel/getSavedParcels";

export const getSavedParcels = {
    url: "/saved-parcels",
    method: "GET" as const,
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
        const userId = request.user?.id;
        if (!userId) {
            return reply.code(401).send({ message: "Unauthorized" });
        }

        const result = await new GetSavedParcelsAction(
            request.server.domainContext
        ).execute(userId);

        return reply.code(200).send(result);
    },
};
