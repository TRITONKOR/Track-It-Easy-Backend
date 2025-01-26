import { Repository } from "typeorm";
import dataSource from "../../../config/data-source";
import { User } from "../../entities/user.entity";

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = dataSource.getRepository(User);
    }

    async findById(id: string): Promise<User | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByName(name: string): Promise<User | null> {
        return await this.repository.findOne({ where: { name } });
    }

    async findAll(): Promise<User[]> {
        return await this.repository.find();
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.repository.findOne({ where: { email } });
            return user || null;
        } catch (error) {
            console.error("Error fetching user by email:", error);
            throw new Error("Failed to find user by email");
        }
    }

    async create(user: Partial<User>): Promise<User> {
        if (!user.name || !user.email || !user.passwordHash) {
            throw new Error("Invalid user data");
        }
        const newUser = this.repository.create(user);
        try {
            return await this.repository.save(newUser);
        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error("Failed to save user");
        }
    }

    async update(
        id: string,
        updatedFields: Partial<User>
    ): Promise<User | null> {
        try {
            await this.repository.update(id, updatedFields);
            return await this.findById(id);
        } catch (error) {
            console.error("Error updating user:", error);
            throw new Error("Failed to update user");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error) {
            console.error("Error deleting user:", error);
            throw new Error("Failed to delete user");
        }
    }
}
