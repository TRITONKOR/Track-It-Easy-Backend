import { CourierRepository } from "@db/repositories/courier.repo";
import { couriersTable } from "@db/schema";
import { HttpException } from "src/api/errors/httpException";
import { Courier } from "../entities/courier.entity";

export class CourierService {
    private courierRepository: CourierRepository;

    constructor(courierRepository: CourierRepository) {
        this.courierRepository = courierRepository;
    }

    async findById(id: string): Promise<Courier> {
        try {
            const courier = await this.courierRepository.findById(id);
            if (!courier) {
                throw new HttpException(404, "Courier not found");
            }
            return courier;
        } catch (error) {
            throw new HttpException(500, "Error finding courier");
        }
    }

    async findByName(name: string): Promise<Courier> {
        try {
            const courier = await this.courierRepository.findByName(name);
            if (!courier) {
                throw new HttpException(404, "Courier not found");
            }
            return courier;
        } catch (error) {
            throw new HttpException(500, "Error finding courier");
        }
    }

    async findAll(): Promise<Courier[] | null> {
        try {
            const couriers = await this.courierRepository.findAll();
            return couriers;
        } catch (error) {
            throw new HttpException(500, "Error retrieving all couriers");
        }
    }

    async create(courier: typeof couriersTable.$inferInsert): Promise<Courier> {
        try {
            const createdCourier = await this.courierRepository.create(courier);
            if (!createdCourier) {
                throw new HttpException(500, "Error creating courier");
            }
            return createdCourier;
        } catch (error) {
            throw new HttpException(500, "Error creating courier");
        }
    }

    async update(
        id: string,
        updatedFields: Partial<typeof CourierRepository.prototype.update>
    ): Promise<Courier | null> {
        try {
            const updatedCourier = await this.courierRepository.update(
                id,
                updatedFields
            );
            if (!updatedCourier) {
                throw new HttpException(404, "Courier not found for update");
            }
            return updatedCourier;
        } catch (error) {
            throw new HttpException(500, "Error updating courier");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.courierRepository.delete(id);
        } catch (error) {
            throw new HttpException(500, "Error deleting courier");
        }
    }
}
