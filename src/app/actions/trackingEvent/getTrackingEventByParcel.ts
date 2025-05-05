import { HttpException } from "src/api/errors/httpException";
import { Parcel } from "src/domain/entities/parcel.entity";
import { TrackingEventService } from "src/domain/services/trackingEvent.service";

export class GetTrackingEventByParcelAction {
    private trackingEventService: TrackingEventService;

    constructor({
        trackingEventService,
    }: {
        trackingEventService: TrackingEventService;
    }) {
        this.trackingEventService = trackingEventService;
    }

    async execute(parcel: Parcel) {
        if (!parcel) {
            throw new HttpException(401, "Missing field");
        }

        try {
            return await this.trackingEventService.findByParcelId(parcel.id);
        } catch (error) {
            console.error(error);
            throw new HttpException(
                500,
                "Failed to fetch followed parcels by user"
            );
        }
    }
}
