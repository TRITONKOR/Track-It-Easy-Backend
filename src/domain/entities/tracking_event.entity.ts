export class TrackingEvent {
    id: string;
    parcelId: string;
    statusId: string;
    location: string;
    isNotified: boolean;
    rawStatus: string;
    timestamp: Date;
    createdAt: Date;

    constructor(
        id: string,
        parcelId: string,
        statusId: string,
        location: string,
        isNotified: boolean,
        rawStatus: string,
        timestamp: Date,
        createdAt: Date
    ) {
        this.id = id;
        this.parcelId = parcelId;
        this.statusId = statusId;
        this.location = location;
        this.isNotified = isNotified;
        this.rawStatus = rawStatus;
        this.timestamp = timestamp;
        this.createdAt = createdAt;
    }
}
