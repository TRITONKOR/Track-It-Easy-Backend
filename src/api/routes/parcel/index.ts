import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { followParcel } from "./followParcel";
import { getSavedParcels } from "./getSavedParcels";
import { trackParcel } from "./trackParcel";
import { unfollowParcel } from "./unfollowParcel";

export const parcelRouter: FastifyPluginAsync = async function (
    fastify: FastifyInstance
) {
    fastify.route(trackParcel);
    fastify.route(getSavedParcels);
    fastify.route(followParcel);
    fastify.route(unfollowParcel);
};
