import { HttpException } from "src/api/errors/httpException";
import { AuthService } from "src/domain/services/auth.service";

export class SignInAction {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async execute(
        email: string,
        password: string
    ): Promise<
        string | { accessToken: string; refreshToken: string; user: any }
    > {
        if (!email || !password) {
            throw new HttpException(401, "Missing fields");
        }

        try {
            const loginResult = await this.authService.login(email, password);
            if (!loginResult) {
                throw new HttpException(401, "Authentication failed");
            }

            const { accessToken, refreshToken, user } = loginResult;

            return { accessToken, refreshToken, user };
        } catch (error) {
            console.error("Error during login:", error);
            throw new HttpException(
                401,
                "An error occurred during authentication"
            );
        }
    }
}
