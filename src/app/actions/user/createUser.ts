import { HttpException } from "src/api/errors/httpException";
import { UserService } from "src/domain/services/user.service";

export class CreateUserAction {
    private userService: UserService;

    constructor({ userService }: { userService: UserService }) {
        this.userService = userService;
    }

    async execute(
        username: string,
        email: string,
        password: string,
        role: "admin" | "user"
    ): Promise<any> {
        if (!username || !email || !password || !role) {
            throw new HttpException(400, "Missing fields");
        }

        try {
            const creaedUser = await this.userService.create({
                username,
                email,
                passwordHash: password,
                role,
            });

            if (!creaedUser) {
                throw new HttpException(500, "Error creating user");
            }
            return {
                id: creaedUser.id,
                username: creaedUser.username,
                email: creaedUser.email,
                role: creaedUser.role,
                createdAt: creaedUser.createdAt,
                updatedAt: creaedUser.updatedAt,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
        }
    }
}
