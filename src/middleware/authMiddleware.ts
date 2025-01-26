import { UserRepository } from "@db/repositories/user.repo";
import { FastifyPluginAsync } from "fastify";
import { AuthService } from "src/domain/services/auth.service";
import { JwtService } from "src/domain/services/jwt.service";

const authenticateToken: FastifyPluginAsync = async (fastify, opts) => {
    const jwtService = new JwtService();
    const userRepository = new UserRepository();
    const authService = new AuthService(userRepository, jwtService);

    fastify.addHook("preHandler", async (request, reply) => {
        const authHeader = request.headers.authorization;
        const token = authHeader?.split(" ")[1];

        if (!token) {
            return reply
                .status(401)
                .send({ message: "Access denied. No token provided" });
        }

        try {
            const decoded = jwtService.verifyAccessToken(token);
            if (!decoded || typeof decoded === "string") {
                return reply.status(403).send({ message: "Invalid token" });
            }

            const user = await userRepository.findById(decoded.userId);
            if (!user) {
                return reply.status(403).send({ message: "User not found." });
            }

            request.user = {
                userId: user.id,
                email: user.email,
            };
        } catch (err) {
            request.log.error(err, "Authentication error");
            return reply.status(403).send({ message: "Invalid token" });
        }
    });
};

export default authenticateToken;
