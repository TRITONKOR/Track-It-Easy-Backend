import cors from "@fastify/cors";
import fastifyRequestContext from "@fastify/request-context";
import fastifyRequestLogger from "@mgcrea/fastify-request-logger";
import Fastify, { FastifyInstance } from "fastify";

import { patchContext } from "./api/context";
import { patchRouting } from "./api/routes";
import { config } from "./config/config";
import { authenticateToken } from "./middleware/authMiddleware";

import fastifyCookie from "@fastify/cookie";

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

        fastify.register(cors, {
            origin: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true,
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
            secure: false,
            httpOnly: true,
            priority: "high",
            sameSite: "lax",
            path: "/",
        },
        prefix: "x-",
    });

    patchContext(fastify);
    patchRouting(fastify);

    const publicRoutes = [
        "/auth/login",
        "/auth/register",
        "/auth/refresh",
        "/track",
    ];

    fastify.addHook("preHandler", async (request, reply) => {
        const routePath = request.routeOptions.url ?? "";
        if (publicRoutes.includes(routePath)) {
            console.log("Public route, skipping authentication:", routePath);
            return;
        }

        await authenticateToken(request, reply);
    });

    return fastify;
};

export default bootstrapFastify;
