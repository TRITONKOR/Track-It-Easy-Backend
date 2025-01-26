import { Repository } from "typeorm";
import dataSource from "../../../config/data-source";
import { Courier } from "../../entities/courier.entity";

export class CourierRepository {
    private repository: Repository<Courier>;

    constructor() {
        this.repository = dataSource.getRepository(Courier);
    }

    async findById(id: string): Promise<Courier | null> {
        try {
            return await this.repository.findOne({ where: { id } });
        } catch (error) {
            console.error("Error fetching courier by id:", error);
            throw new Error("Failed to find courier by id");
        }
    }

    async findAll(): Promise<Courier[]> {
        try {
            return await this.repository.find();
        } catch (error) {
            console.error("Error fetching all couriers:", error);
            throw new Error("Failed to fetch all couriers");
        }
    }

    async create(courier: Partial<Courier>): Promise<Courier> {
        if (!courier.name || !courier.api) {
            throw new Error("Invalid courier data");
        }
        const newCourier = this.repository.create(courier);
        try {
            return await this.repository.save(newCourier);
        } catch (error) {
            console.error("Error saving courier:", error);
            throw new Error("Failed to save courier");
        }
    }

    async update(
        id: string,
        updatedFields: Partial<Courier>
    ): Promise<Courier | null> {
        try {
            await this.repository.update(id, updatedFields);
            return await this.findById(id);
        } catch (error) {
            console.error("Error updating courier:", error);
            throw new Error("Failed to update courier");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error) {
            console.error("Error deleting courier:", error);
            throw new Error("Failed to delete courier");
        }
    }
}
