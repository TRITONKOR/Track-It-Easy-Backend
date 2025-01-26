import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { track } from "./track";

export const trackRouter: FastifyPluginAsync = async function (
    fastify: FastifyInstance
) {
    fastify.route(track);
};
