import { HttpException } from "src/api/errors/httpException";
import { TrackingService } from "src/domain/services/tracking.service";

export class TrackAction {
    private trackService: TrackingService;

    constructor({ trackService }: { trackService: TrackingService }) {
        console.log("constructor " + trackService);
        this.trackService = trackService;
    }

    async execute(courier: string, trackingNumber: string) {
        if (!trackingNumber || !courier) {
            throw new HttpException(401, "Missing field");
        }
        if (courier !== "nova" && courier !== "ukr") {
            throw new HttpException(401, "Invalid courier");
        }

        try {
            console.log(this.trackService);
            return await this.trackService.trackPackage(
                courier,
                trackingNumber
            );
        } catch (error) {
            console.error(error);
            throw new HttpException(401, "Track package failed");
        }
    }
}
