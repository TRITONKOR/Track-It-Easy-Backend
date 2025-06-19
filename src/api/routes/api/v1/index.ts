import { FastifyInstance, FastifyPluginAsync } from "fastify";

import { followParcelApiKey } from "./followParcelApiKey";
import { trackParcelApiKey } from "./trackParcelApiKey";
import { unfollowParcelApiKey } from "./unfollowParcelApiKey";

export const apiV1Router: FastifyPluginAsync = async function (
    fastify: FastifyInstance
) {
    fastify.route(trackParcelApiKey);
    fastify.route(followParcelApiKey);
    fastify.route(unfollowParcelApiKey);
};
