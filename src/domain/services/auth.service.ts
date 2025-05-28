import { HttpException } from "@/api/errors/httpException";
import { User } from "@/domain/entities/user.entity";
import { UserRepository } from "@db/repositories/user.repo";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { JwtService } from "./jwt.service";

export class AuthService {
    private userRepository: UserRepository;
    private jwtService: JwtService;

    constructor(userRepository: UserRepository, jwtService: JwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    async generatePasswordHash(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async register(user: {
        username: string;
        email: string;
        password: string;
    }): Promise<User> {
        const { username, email, password } = user;
        const passwordHash = await this.generatePasswordHash(password);

        const newUser = await this.userRepository.create({
            username,
            email,
            passwordHash: passwordHash,
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return newUser;
    }

    async authenticateUser(
        email: string,
        password: string
    ): Promise<Omit<Partial<User>, "passwordHash"> | null> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.passwordHash) {
            return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        const { passwordHash, ...userWithoutPasswordHash } = user;

        return userWithoutPasswordHash;
    }

    async #authorizeUser(user: Omit<Partial<User>, "passwordHash">) {
        const sessionId = crypto.randomBytes(6).toString("hex");

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
            throw new HttpException(403, "Invalid token provided");
        }

        const payload = this.jwtService.verifyRefreshToken(refreshToken);
        if (!payload || typeof payload !== "object") {
            throw new Error("Invalid refresh token");
        }

        const { sessionId, userId } = payload;

        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new HttpException(404, "User not found");
        }

        const newAccessToken = this.jwtService.createAccessToken({
            userId: user.id,
            userRole: user.role,
        });

        const newRefreshToken = this.jwtService.createRefreshToken({
            userId: user.id,
            sessionId: sessionId,
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            user,
        };
    }
}
