import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { FastifyInstance } from "fastify";

export async function registerPublicSwagger(app: FastifyInstance) {
    await app.register(swagger, {
        swagger: {
            info: {
                title: "Track-It-Easy Public API",
                version: "1.0.0",
                description: "Public endpoints: login, register, track",
            },
            tags: [
                { name: "auth", description: "Authentication" },
                { name: "tracking", description: "Parcel tracking" },
                { name: "parcels", description: "Parcel management" },
                { name: "api-key", description: "API key management" },
            ],
        },
    });

    await app.register(swaggerUI, {
        routePrefix: "/docs",
        uiConfig: {
            docExpansion: "list",
        },
    });
}
