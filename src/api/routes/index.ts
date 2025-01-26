import { FastifyInstance } from "fastify";
import { authRouter } from "./auth";
import { trackRouter } from "./track";

export const patchRouting = (fastify: FastifyInstance) => {
    fastify.setNotFoundHandler((request, reply) => {
        reply.status(404).send({ error: "Not Found" });
    });

    fastify.setErrorHandler((error, request, reply) => {
        fastify.log.error(error);

        const statusCode = error.statusCode || 500;

        if (error.validation) {
            return reply.status(statusCode).send({
                error: "Invalid request",
                message: error.message,
            });
        }

        reply.status(statusCode).send({ error: "Internal Server Error" });
    });

    registerRoutes(fastify);
};

const registerRoutes = (fastify: FastifyInstance) => {
    fastify.register(authRouter);
    fastify.register(trackRouter);
};
