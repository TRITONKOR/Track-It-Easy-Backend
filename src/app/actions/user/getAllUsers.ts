import { HttpException } from "src/api/errors/httpException";
import { User } from "src/domain/entities/user.entity";
import { UserService } from "src/domain/services/user.service";

export class GetAllUsersAction {
    private userService: UserService;

    constructor({ userService }: { userService: UserService }) {
        this.userService = userService;
    }

    async execute(): Promise<User[]> {
        try {
            const users = await this.userService.findAll();

            if (!users) {
                throw new HttpException(500, "Error getting all users");
            }
            return users;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            return [];
        }
    }
}
