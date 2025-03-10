import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { getParcel } from "./getParcel";
import { getSavedParcels } from "./getSavedParcels";

export const parcelRouter: FastifyPluginAsync = async function (
    fastify: FastifyInstance
) {
    fastify.route(getParcel);
    fastify.route(getSavedParcels);
};
