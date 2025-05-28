import { JwtService } from "@/domain/services/jwt.service";
import { UserRepository } from "@db/repositories/user.repo";
import { FastifyReply, FastifyRequest } from "fastify";

const jwtService = new JwtService();
const userRepository = new UserRepository();

export const authenticateToken = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
    const authHeader = request.headers["x-Authorization"]?.toString();
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return reply
            .status(401)
            .send({ message: "Access denied. No token provided" });
    }

    try {
        const decoded = jwtService.verifyAccessToken(token);
        if (!decoded || typeof decoded === "string") {
            return reply.status(401).send({ message: "Invalid token" });
        }

        const user = await userRepository.findById(decoded.userId);
        if (!user) {
            return reply.status(403).send({ message: "User not found." });
        }

        request.user = {
            id: user.id,
            email: user.email,
        };
    } catch (err) {
        request.log.error(err, "Authentication error");
        return reply.status(401).send({ message: "Invalid token" });
    }
};
