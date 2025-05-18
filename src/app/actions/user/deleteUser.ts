import { HttpException } from "@/api/errors/httpException";
import { UserService } from "@/domain/services/user.service";

export class DeleteUserAction {
    private userService: UserService;

    constructor({ userService }: { userService: UserService }) {
        this.userService = userService;
    }

    async execute(userId: string, accessToken: string): Promise<void> {
        try {
            await this.userService.delete(userId);

            return;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
        }
    }
}
