import { User } from "@/domain/entities/user.entity";

export interface CreateUserData {
    username: string;
    email: string;
    passwordHash: string;
    role?: "admin" | "user";
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UpdateUserData {
    username?: string;
    email?: string;
    role?: "admin" | "user";
    updatedAt?: Date;
}

export interface IUserRepository {
    /**
     * Finds a user by ID
     * @param id User ID
     * @returns User or null if not found
     */
    findById(id: string): Promise<User | null>;

    /**
     * Finds a user by username
     * @param username Username to search for
     * @returns Partial user data or null if not found
     */
    findByUsername(username: string): Promise<User | null>;

    /**
     * Finds a user by email
     * @param email Email to search for
     * @returns User or null if not found
     */
    findByEmail(email: string): Promise<User | null>;

    /**
     * Retrieves all users
     * @returns Array of all users
     */
    findAll(): Promise<User[]>;

    /**
     * Creates a new user
     * @param user User creation data
     * @returns The created user
     */
    create(user: CreateUserData): Promise<User>;

    /**
     * Updates an existing user
     * @param id User ID to update
     * @param updatedFields Fields to update
     * @returns The updated user
     */
    update(id: string, updatedFields: UpdateUserData): Promise<User>;

    /**
     * Deletes a user
     * @param id User ID to delete
     * @returns Promise that resolves when deletion is complete
     */
    delete(id: string): Promise<void>;
}
