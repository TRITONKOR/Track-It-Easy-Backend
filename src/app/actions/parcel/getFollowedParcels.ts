import { HttpException } from "@/api/errors/httpException";
import { ParcelRepository } from "@db/repositories/parcel.repo";

export class GetFollowedParcelsAction {
    private parcelRepository: ParcelRepository;

    constructor({ parcelRepository }: { parcelRepository: ParcelRepository }) {
        this.parcelRepository = parcelRepository;
    }

    async execute(userId: string) {
        if (!userId) {
            throw new HttpException(401, "Unauthorized");
        }

        try {
            return await this.parcelRepository.findByUserId(userId);
        } catch (error) {
            console.error(error);
            throw new HttpException(
                500,
                "Failed to fetch followed parcels by user"
            );
        }
    }
}
