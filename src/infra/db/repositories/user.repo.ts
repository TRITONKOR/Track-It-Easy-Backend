import { eq } from "drizzle-orm";
import { User } from "src/domain/entities/user.entity";
import { db } from "../index";
import { usersTable } from "../schema";
import {
    CreateUserData,
    IUserRepository,
    UpdateUserData,
} from "./interfaces/UserRepository";

export class UserRepository implements IUserRepository {
    async findById(id: string) {
        const users = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, id));
        return users[0] || null;
    }

    async findByUsername(username: string): Promise<User | null> {
        const users = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username));
        return users[0] || null;
    }

    async findAll(): Promise<User[]> {
        return await db.select().from(usersTable);
    }

    async findByEmail(email: string): Promise<User | null> {
        const users = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if (!users.length) return null;

        return new User(users[0]);
    }

    async create(user: CreateUserData): Promise<User> {
        const [newUser] = await db.insert(usersTable).values(user).returning();
        return new User(newUser);
    }

    async update(id: string, updatedFields: UpdateUserData): Promise<User> {
        const [updatedUser] = await db
            .update(usersTable)
            .set({ ...updatedFields, updatedAt: new Date() })
            .where(eq(usersTable.id, id))
            .returning();
        return new User(updatedUser);
    }

    async delete(id: string): Promise<void> {
        await db.delete(usersTable).where(eq(usersTable.id, id));
    }
}
