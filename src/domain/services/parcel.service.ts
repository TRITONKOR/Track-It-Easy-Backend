import { HttpException } from "@/api/errors/httpException";
import { ParcelRepository } from "@db/repositories/parcel.repo";
import { parcelsTable } from "@db/schema";
import { Parcel } from "../entities/parcel.entity";

export class ParcelService {
    private parcelRepository: ParcelRepository;

    constructor(parcelRepository: ParcelRepository) {
        this.parcelRepository = parcelRepository;
    }

    async findById(id: string): Promise<Parcel | null> {
        try {
            const parcel = await this.parcelRepository.findById(id);
            if (!parcel) {
                throw new HttpException(404, "Parcel not found");
            }
            return parcel;
        } catch (error) {
            throw new HttpException(500, "Error finding parcel");
        }
    }

    async findByTrackingNumber(trackingNumber: string): Promise<Parcel | null> {
        try {
            const parcel = await this.parcelRepository.findByTrackingNumber(
                trackingNumber
            );
            if (!parcel) {
                throw new HttpException(
                    404,
                    "Parcel not found with the provided tracking number"
                );
            }
            return parcel;
        } catch (error) {
            throw new HttpException(
                500,
                "Error finding parcel by tracking number"
            );
        }
    }

    async findAll(): Promise<Parcel[]> {
        try {
            const parcels = await this.parcelRepository.findAll();
            return parcels;
        } catch (error) {
            throw new HttpException(500, "Error retrieving all parcels");
        }
    }

    async isParcelFollowedByUserId(
        userId: string,
        trackingNumber: string
    ): Promise<boolean> {
        try {
            const parcel = await this.parcelRepository.findByTrackingNumber(
                trackingNumber
            );
            if (!parcel) {
                throw new HttpException(
                    404,
                    "Parcel not found with the provided tracking number"
                );
            }
            const isFollowed =
                await this.parcelRepository.isParcelFollowedByUserId(
                    userId,
                    parcel.id
                );
            return isFollowed;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
            throw new HttpException(
                500,
                "Error checking if parcel is followed by user"
            );
        }
    }

    async followParcel(userId: string, parcelId: string): Promise<void> {
        try {
            await this.parcelRepository.followParcel(userId, parcelId);
        } catch (error) {
            throw new HttpException(500, "Error saving parcel for user");
        }
    }

    async unfollowParcel(userId: string, parcelId: string): Promise<void> {
        try {
            await this.parcelRepository.unfollowParcel(userId, parcelId);
        } catch (error) {
            throw new HttpException(500, "Error removing parcel for user");
        }
    }

    async create(parcel: typeof parcelsTable.$inferInsert): Promise<Parcel> {
        try {
            const createdParcel = await this.parcelRepository.create(parcel);
            if (!createdParcel) {
                throw new HttpException(500, "Error creating parcel");
            }
            return createdParcel;
        } catch (error) {
            throw new HttpException(500, "Error creating parcel");
        }
    }

    async update(
        id: string,
        updatedFields: Partial<typeof ParcelRepository.prototype.update>
    ): Promise<Parcel | null> {
        try {
            const updatedParcel = await this.parcelRepository.update(
                id,
                updatedFields
            );
            if (!updatedParcel) {
                throw new HttpException(404, "Parcel not found for update");
            }
            return updatedParcel;
        } catch (error) {
            throw new HttpException(500, "Error updating parcel");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.parcelRepository.delete(id);
        } catch (error) {
            throw new HttpException(500, "Error deleting parcel");
        }
    }

    async findByUserId(userId: string): Promise<Parcel[]> {
        try {
            const parcels = await this.parcelRepository.findByUserId(userId);
            return parcels;
        } catch (error) {
            throw new HttpException(500, "Error finding parcels for user");
        }
    }
}
