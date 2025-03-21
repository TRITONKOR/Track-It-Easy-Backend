import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { getSavedParcels } from "./getSavedParcels";
import { trackParcel } from "./trackParcel";

export const parcelRouter: FastifyPluginAsync = async function (
    fastify: FastifyInstance
) {
    fastify.route(trackParcel);
    fastify.route(getSavedParcels);
};
