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

    /**
     * Create an Access Token
     * @param payload The object to encode in the token
     * @param expiresIn Token expiration time (default is 15 minutes)
     * @returns A string Access Token
     */
    createAccessToken(payload: object, expiresIn = "15m"): string {
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn });
    }

    /**
     * Create a Refresh Token
     * @param payload The object to encode in the token
     * @param expiresIn Token expiration time (default is 7 days)
     * @returns A string Refresh Token
     */
    createRefreshToken(payload: object, expiresIn = "7d"): string {
        return jwt.sign(payload, this.refreshTokenSecret, { expiresIn });
    }

    /**
     * Verify an Access Token
     * @param token The Access Token to verify
     * @returns The decoded token object, string or null if invalid
     */
    verifyAccessToken(token: string): string | JwtPayload | null {
        try {
            return jwt.verify(token, this.accessTokenSecret);
        } catch (err) {
            console.error("Invalid Access Token:", err);
            return null;
        }
    }

    /**
     * Verify a Refresh Token
     * @param token The Refresh Token to verify
     * @returns The decoded token object, string or null if invalid
     */
    verifyRefreshToken(token: string): string | JwtPayload | null {
        try {
            return jwt.verify(token, this.refreshTokenSecret);
        } catch (err) {
            console.error("Invalid Refresh Token:", err);
            return null;
        }
    }
}
