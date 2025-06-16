import { UserService } from "@/domain/services/user.service";

export class GenerateApiKeyAction {
    private userService: UserService;
    constructor({ userService }: { userService: UserService }) {
        this.userService = userService;
    }
    async execute(userId: string) {
        return this.userService.generateApiKey(userId);
    }
}
