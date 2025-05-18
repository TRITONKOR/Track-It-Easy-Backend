import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { deleteParcel } from "./deleteParcel";
import { followParcel } from "./followParcel";
import { getAllParcels } from "./getAllParcels";
import { getFollowedParcels } from "./getFollowedParcels";
import { trackParcel } from "./trackParcel";
import { unfollowParcel } from "./unfollowParcel";

export const parcelRouter: FastifyPluginAsync = async function (
    fastify: FastifyInstance
) {
    fastify.route(trackParcel);
    fastify.route(getFollowedParcels);
    fastify.route(followParcel);
    fastify.route(unfollowParcel);
    fastify.route(getAllParcels);
    fastify.route(deleteParcel);
};
