import fastifyRequestContext from "@fastify/request-context";
import fastifyRequestLogger from "@mgcrea/fastify-request-logger";
import Fastify, { FastifyInstance } from "fastify";

import { patchContext } from "./api/context";
import { patchRouting } from "./api/routes";
import { config } from "./config/config";
import { authenticateToken } from "./middleware/authMiddleware";

import fastifyCookie from "@fastify/cookie";
import "reflect-metadata";

const bootstrapFastify = (): FastifyInstance => {
    const fastify = Fastify({
        exposeHeadRoutes: false,
        connectionTimeout: 20000,
        ignoreTrailingSlash: false,
        logger: !config.IS_DEV_ENV || {
            level: "debug",
            transport: {
                target: "@mgcrea/pino-pretty-compact",
                options: {
                    colorize: true,
                    translateTime: "HH:MM:ss Z",
                    ignore: "pid,hostname",
                },
            },
        },
        disableRequestLogging: true,
    });

    if (config.IS_DEV_ENV) {
        fastify.register(fastifyRequestLogger, {});

        fastify.ready(() => {
            console.log(`\nAPI Structure\n${fastify.printRoutes()}`);
        });
    }

    fastify.register(fastifyRequestContext, {
        hook: "preValidation",
        defaultStoreValues: {
            hasSession: false,
            sessionData: {},
        },
    });

    fastify.register(fastifyCookie, {
        secret: config.COOKIE_SECRET,
        parseOptions: {
            secure: true,
            httpOnly: true,
            priority: "high",
            sameSite: "strict",
        },
        prefix: "x-",
    });

    patchContext(fastify);
    patchRouting(fastify);

    const publicRoutes = ["/auth/sign-in", "/auth/sign-up"];

    fastify.addHook("preHandler", async (request, reply) => {
        if (publicRoutes.includes(request.routerPath)) {
            return;
        }

        await authenticateToken(request, reply);
    });

    return fastify;
};

export default bootstrapFastify;
