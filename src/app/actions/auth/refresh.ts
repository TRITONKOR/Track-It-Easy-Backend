import { HttpException } from "@/api/errors/httpException";
import { AuthService } from "@/domain/services/auth.service";

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
            throw new HttpException(403, "Invalid token are provided");
        }

        try {
            const sessionData = await this.authService.refreshTokensPair(
                refreshToken
            );

            return sessionData;
        } catch (error) {
            console.error(error);
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
            throw new HttpException(401, errorMessage);
        }
    }
}
