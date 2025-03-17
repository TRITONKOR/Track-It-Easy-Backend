import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { login } from "./login";
import { refresh } from "./refresh";
import { register } from "./register";

export const authRouter: FastifyPluginAsync = async function (
    fastify: FastifyInstance
) {
    fastify.route(register);
    fastify.route(login);
    fastify.route(refresh);
};
