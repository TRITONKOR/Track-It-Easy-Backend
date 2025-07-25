import { usersTable } from "@db/schema";
import { InferSelectModel } from "drizzle-orm";

export class User {
    id: string;
    username: string;
    email: string;
    passwordHash: string | null;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
    apiKey: string | null;

    constructor(user: InferSelectModel<typeof usersTable>) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.passwordHash = user.passwordHash;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.apiKey = user.apiKey ?? null;
    }
}
