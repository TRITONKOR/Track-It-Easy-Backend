import { UserRepository } from "@db/repositories/user.repo";
import bcrypt from "bcrypt";
import { HttpException } from "src/api/errors/httpException";
import { User } from "src/infra/entities/user.entity";
import { JwtService } from "./jwt.service";

export class AuthService {
    private userRepository: UserRepository;
    private jwtService: JwtService;

    constructor(userRepository: UserRepository, jwtService: JwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    /**
     * Generate password hash.
     * @param {string} password
     * @returns {Promise<string>}
     */
    async generatePasswordHash(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async register(user: {
        name: string;
        email: string;
        password: string;
    }): Promise<User> {
        const { name, email, password } = user;
        const passwordHash = await this.generatePasswordHash(password);

        return await this.userRepository.create({
            name,
            email,
            passwordHash,
        });
    }

    async authenticateUser(
        email: string,
        password: string
    ): Promise<Omit<User, "passwordHash"> | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.passwordHash) {
            return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        const { passwordHash, ...userWithoutPasswordHash } = user;

        return userWithoutPasswordHash;
    }

    async #authorizeUser(user: Omit<User, "passwordHash">) {
        const sessionId = require("crypto").randomBytes(6).toString("hex");

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.createAccessToken({
                userRole: user.role,
                userId: user.id,
                sessionId,
            }),
            this.jwtService.createRefreshToken({
                userId: user.id,
                sessionId,
            }),
        ]);

        return { accessToken, refreshToken, user };
    }

    async login(email: string, password: string) {
        const user = await this.authenticateUser(email, password);
        if (!user) return null;

        return this.#authorizeUser(user);
    }

    async refreshTokensPair(
        refreshToken: string
    ): Promise<{ accessToken: string; refreshToken: string; user: any }> {
        if (!refreshToken) {
            throw new HttpException(401, "Invalid token provided");
        }

        const payload = this.jwtService.verifyRefreshToken(refreshToken);
        if (!payload || typeof payload !== "object") {
            throw new Error("Invalid refresh token");
        }

        const { sessionId, userId } = payload;

        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }

        const newAccessToken = this.jwtService.createAccessToken(
            { userId: user.id, userRole: user.role },
            "15m"
        );

        const newRefreshToken = this.jwtService.createRefreshToken(
            { userId: user.id, sessionId: payload.sessionId },
            "7d"
        );

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user,
        };
    }
}
