import { UpdateUserData } from "@db/repositories/interfaces/UserRepository";
import { HttpException } from "src/api/errors/httpException";
import { UserService } from "src/domain/services/user.service";

export class UpdateUserAction {
    private userService: UserService;

    constructor({ userService }: { userService: UserService }) {
        this.userService = userService;
    }

    async execute(userId: string, userData: UpdateUserData): Promise<any> {
        if (!userId || !userData) {
            throw new HttpException(400, "Missing fields");
        }

        try {
            const updatedUser = await this.userService.update(userId, userData);

            if (!updatedUser) {
                throw new HttpException(500, "Error updating user");
            }
            return {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt,
                updatedAt: updatedUser.updatedAt,
            };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
        }
    }
}
