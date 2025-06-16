import { UserRepository } from "@/infra/db/repositories/user.repo";
import { FastifyReply, FastifyRequest } from "fastify";

export const apiKeyAuth = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const apiKey = request.headers["x-api-key"];
    if (!apiKey || typeof apiKey !== "string") {
        return reply.status(401).send({ message: "API key required" });
    }
    const userRepo = new UserRepository();
    const user = await userRepo.findByApiKey(apiKey);
    if (!user) {
        return reply.status(401).send({ message: "Invalid API key" });
    }
};
