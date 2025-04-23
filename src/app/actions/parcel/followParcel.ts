import { HttpException } from "src/api/errors/httpException";
import { ParcelService } from "src/domain/services/parcel.service";

export class FollowParcelAction {
    private parcelService: ParcelService;

    constructor({ parcelService }: { parcelService: ParcelService }) {
        this.parcelService = parcelService;
    }

    async execute(trackingNumber: string, userId: string) {
        if (!trackingNumber) {
            throw new HttpException(400, "Missing tracking number");
        }

        if (!userId) {
            throw new HttpException(400, "Missing user ID");
        }

        try {
            const existingParcel =
                await this.parcelService.findByTrackingNumber(trackingNumber);

            if (!existingParcel) {
                throw new HttpException(
                    404,
                    "Parcel not found with this tracking number"
                );
            }

            await this.parcelService.followParcel(
                userId,
                existingParcel.getId()
            );

            return { trackingNumber, userId };
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            console.error("Save parcel failed:", error);
            throw new HttpException(500, "Failed to save parcel for user");
        }
    }
}
