import { HttpException } from "src/api/errors/httpException";
import { TrackingService } from "src/domain/services/tracking.service";

export class GetParcelAction {
    private trackingService: TrackingService;

    constructor({ trackingService }: { trackingService: TrackingService }) {
        this.trackingService = trackingService;
    }

    async execute(courier: string, trackingNumber: string) {
        if (!trackingNumber || !courier) {
            throw new HttpException(401, "Missing field");
        }
        if (courier !== "nova" && courier !== "ukr") {
            throw new HttpException(401, "Invalid courier");
        }

        try {
            const response = await this.trackingService.trackParcel(
                courier,
                trackingNumber
            );

            console.log(response);
            return response;
        } catch (error) {
            console.error(error);
            throw new HttpException(401, "Track package failed");
        }
    }
}
