import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { createUser } from "./createUser";
import { deleteUser } from "./deleteUser";
import { generateApiKey } from "./generateApiKey";
import { getAllUsers } from "./getAllUsers";
import { updateUser } from "./updateUser";

export const userRouter: FastifyPluginAsync = async function (
    fastify: FastifyInstance
) {
    fastify.route(createUser);
    fastify.route(updateUser);
    fastify.route(getAllUsers);
    fastify.route(deleteUser);
    fastify.route(generateApiKey);
};
