import { HttpException } from "src/api/errors/httpException";
import { AuthService } from "src/domain/services/auth.service";

export class RefreshAction {
    private authService: AuthService;

    constructor({ authService }: { authService: AuthService }) {
        this.authService = authService;
    }

    async execute(
        refreshToken: string,
        _sessionData?: Record<string, unknown>
    ) {
        if (!refreshToken) {
            throw new HttpException(401, "Invalid token are provided");
        }

        try {
            console.error("refreshToken", refreshToken);
            const sessionData = await this.authService.refreshTokensPair(
                refreshToken
            );

            return sessionData;
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            throw new HttpException(401, errorMessage);
        }
    }
}
