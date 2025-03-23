import { trackingEventsTable } from "@db/schema";
import { InferSelectModel } from "drizzle-orm";

export class TrackingEvent {
    id: string;
    parcelId: string;
    statusLocation: string;
    isNotified: boolean;
    rawStatus: string;
    timestamp: Date;
    createdAt: Date;

    constructor(trackingEvent: InferSelectModel<typeof trackingEventsTable>) {
        this.id = trackingEvent.id;
        this.parcelId = trackingEvent.parcelId;
        this.statusLocation = trackingEvent.statusLocation;
        this.isNotified = trackingEvent.isNotified;
        this.rawStatus = trackingEvent.rawStatus;
        this.timestamp = trackingEvent.timestamp;
        this.createdAt = trackingEvent.createdAt;
    }
}
