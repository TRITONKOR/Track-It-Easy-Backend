import { HttpException } from "@/api/errors/httpException";
import { AuthService } from "@/domain/services/auth.service";
import { UserRepository } from "@db/repositories/user.repo";

export class RegisterAction {
    private userRepository: UserRepository;
    private authService: AuthService;

    constructor({
        userRepository,
        authService,
    }: {
        userRepository: UserRepository;
        authService: AuthService;
    }) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    async execute(username: string, email: string, password: string) {
        if (!username || !email || !password) {
            throw new HttpException(401, "Missing fields");
        }

        if (await this.userRepository.findByEmail(email)) {
            throw new HttpException(401, "User already exist");
        }

        try {
            return await this.authService.register({
                username,
                email,
                password,
            });
        } catch (error) {
            console.error("Registration error:", error);
            throw new HttpException(401, "Registration failed");
        }
    }
}
