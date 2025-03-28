import { HttpException } from "src/api/errors/httpException";
import { TrackingService } from "src/domain/services/tracking.service";

export class TrackParcelAction {
    private trackingService: TrackingService;

    constructor({ trackingService }: { trackingService: TrackingService }) {
        this.trackingService = trackingService;
    }

    async execute(trackingNumber: string) {
        if (!trackingNumber) {
            throw new HttpException(401, "Missing field");
        }

        try {
            const response = await this.trackingService.trackParcel(
                trackingNumber
            );

            return response;
        } catch (error) {
            console.error(error);
            throw new HttpException(401, "Track package failed");
        }
    }
}
