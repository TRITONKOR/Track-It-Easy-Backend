import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../../config/config";

export class JwtService {
    private accessTokenSecret: string;
    private refreshTokenSecret: string;

    constructor() {
        this.accessTokenSecret = config.ACCESS_SECRET;
        this.refreshTokenSecret = config.REFRESH_SECRET;

        if (!config.ACCESS_SECRET || !config.REFRESH_SECRET) {
            console.warn(
                "ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET is not set in the .env file."
            );
        }
    }

    createAccessToken(payload: object, expiresIn = "15m"): string {
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn });
    }

    createRefreshToken(payload: object, expiresIn = "7d"): string {
        return jwt.sign(payload, this.refreshTokenSecret, { expiresIn });
    }

    verifyAccessToken(token: string): string | JwtPayload | null {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        } catch (err) {
            console.error("Invalid Access Token:", err);
            return null;
        }
    }

    verifyRefreshToken(token: string): string | JwtPayload | null {
        try {
            return jwt.verify(token, this.refreshTokenSecret);
        } catch (err) {
            console.error("Invalid Refresh Token:", err);
            return null;
        }
    }
}
