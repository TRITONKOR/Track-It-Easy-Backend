import { FastifyInstance } from "fastify";
import { domainContext } from "../../app/context";

export const patchContext = (fastify: FastifyInstance): void => {
    fastify.decorate("domainContext", domainContext);
};
