import { Repository } from "typeorm";
import dataSource from "../../../config/data-source";
import { Parcel } from "../../entities/parcel.entity";

export class ParcelRepository {
    private repository: Repository<Parcel>;

    constructor() {
        this.repository = dataSource.getRepository(Parcel);
    }

    async findById(id: string): Promise<Parcel | null> {
        return await this.repository.findOne({ where: { id } });
    }

    async findByTrackingNumber(trackingNumber: string): Promise<Parcel | null> {
        return await this.repository.findOne({ where: { trackingNumber } });
    }

    async findAll(): Promise<Parcel[]> {
        return await this.repository.find();
    }

    async findByUserId(userId: string): Promise<Parcel | null> {
        try {
            const parcel = await this.repository.findOne({ where: { userId } });
            return parcel || null;
        } catch (error) {
            console.error("Error fetching parcel by userId:", error);
            throw new Error("Failed to find parcel by userId");
        }
    }

    async create(parcel: Partial<Parcel>): Promise<Parcel> {
        if (
            !parcel.trackingNumber ||
            !parcel.userId ||
            !parcel.statusId ||
            !parcel.courierId
        ) {
            throw new Error("Invalid parcel data");
        }
        const newParcel = this.repository.create(parcel);
        try {
            return await this.repository.save(newParcel);
        } catch (error) {
            console.error("Error saving parcel:", error);
            throw new Error("Failed to save parcel");
        }
    }

    async update(
        id: string,
        updatedFields: Partial<Parcel>
    ): Promise<Parcel | null> {
        try {
            await this.repository.update(id, updatedFields);
            return await this.findById(id);
        } catch (error) {
            console.error("Error updating parcel:", error);
            throw new Error("Failed to update parcel");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error) {
            console.error("Error deleting parcel:", error);
            throw new Error("Failed to delete parcel");
        }
    }
}
