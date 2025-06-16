import bootstrapFastify from "./app";
import { config } from "./config/config";

let fastify;

const startServer = async () => {
    fastify = await bootstrapFastify();

    try {
        await fastify.listen({
            port: Number(config.PORT),
            host: String(config.HOST),
        });
        console.log(`Server listening on ${config.HOST}:${config.PORT}`);
    } catch (err) {
        console.error(err);
    }
};

startServer();
