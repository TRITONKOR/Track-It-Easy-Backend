import { HttpException } from "@/api/errors/httpException";
import {
    CreateUserData,
    IUserRepository,
    UpdateUserData,
} from "@db/repositories/interfaces/UserRepository";
import bcrypt from "bcryptjs";
import { User } from "../entities/user.entity";

export class UserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async findById(id: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new HttpException(404, "User not found");
            }
            return user;
        } catch (error) {
            throw new HttpException(500, "Error finding user by ID");
        }
    }

    async findByUsername(username: string): Promise<User> {
        try {
            const user = await this.userRepository.findByUsername(username);
            if (!user) {
                throw new HttpException(404, "User not found");
            }
            return user;
        } catch (error) {
            throw new HttpException(500, "Error finding user by username");
        }
    }

    async findByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new HttpException(404, "User not found");
            }
            return user;
        } catch (error) {
            throw new HttpException(500, "Error finding user by email");
        }
    }

    async findAll(): Promise<User[] | null> {
        try {
            const users = await this.userRepository.findAll();
            return users;
        } catch (error) {
            throw new HttpException(500, "Error retrieving all users");
        }
    }

    async create(user: CreateUserData): Promise<User> {
        try {
            const saltRounds = 10;
            user.passwordHash = await bcrypt.hash(
                user.passwordHash,
                saltRounds
            );

            const createdUser = await this.userRepository.create(user);
            if (!createdUser) {
                throw new HttpException(500, "Error creating user");
            }
            return createdUser;
        } catch (error) {
            throw new HttpException(500, "Error creating user");
        }
    }

    async update(
        id: string,
        updatedFields: UpdateUserData
    ): Promise<User | null> {
        try {
            const updatedUser = await this.userRepository.update(
                id,
                updatedFields
            );
            if (!updatedUser) {
                throw new HttpException(404, "User not found for update");
            }
            return updatedUser;
        } catch (error) {
            throw new HttpException(500, "Error updating user");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.userRepository.delete(id);
        } catch (error) {
            throw new HttpException(500, "Error deleting user");
        }
    }

    async generateApiKey(userId: string): Promise<string> {
        return this.userRepository.generateApiKey(userId);
    }
}
