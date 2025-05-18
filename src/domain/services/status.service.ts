import { HttpException } from "@/api/errors/httpException";
import { StatusRepository } from "@db/repositories/status.repo";
import { statusesTable } from "@db/schema";
import { Status } from "../entities/status.entity";

export class StatusService {
    private statusRepository: StatusRepository;

    constructor(statusRepository: StatusRepository) {
        this.statusRepository = statusRepository;
    }

    async findById(id: string): Promise<Status> {
        try {
            const status = await this.statusRepository.findById(id);
            if (!status) {
                throw new HttpException(404, "Status not found");
            }
            return status;
        } catch (error) {
            throw new HttpException(500, "Error finding status");
        }
    }

    async findByName(name: string): Promise<Status> {
        try {
            const status = await this.statusRepository.findByName(name);
            if (!status) {
                throw new HttpException(404, "Status not found");
            }
            return status;
        } catch (error) {
            throw new HttpException(500, "Error finding status");
        }
    }

    async findAll(): Promise<Status[] | null> {
        try {
            const statuses = await this.statusRepository.findAll();
            return statuses;
        } catch (error) {
            throw new HttpException(500, "Error retrieving all statuses");
        }
    }

    async create(status: typeof statusesTable.$inferInsert): Promise<Status> {
        try {
            const createdStatus = await this.statusRepository.create(status);
            if (!createdStatus) {
                throw new HttpException(500, "Error creating status");
            }
            return createdStatus;
        } catch (error) {
            throw new HttpException(500, "Error creating status");
        }
    }

    async update(
        id: string,
        updatedFields: Partial<typeof StatusRepository.prototype.update>
    ): Promise<Status | null> {
        try {
            const updatedStatus = await this.statusRepository.update(
                id,
                updatedFields
            );
            if (!updatedStatus) {
                throw new HttpException(404, "Status not found for update");
            }
            return updatedStatus;
        } catch (error) {
            throw new HttpException(500, "Error updating status");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.statusRepository.delete(id);
        } catch (error) {
            throw new HttpException(500, "Error deleting status");
        }
    }
}
