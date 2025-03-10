import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { refresh } from "./refresh";
import { signIn } from "./sign-in";
import { signUp } from "./sign-up";

export const authRouter: FastifyPluginAsync = async function (
    fastify: FastifyInstance
) {
    fastify.route(signUp);
    fastify.route(signIn);
    fastify.route(refresh);
};
