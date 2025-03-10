export class Notification {
    id: string;
    parcelId: string;
    userId: string;
    message: string;
    sentAt: Date;

    constructor(
        id: string,
        parcelId: string,
        userId: string,
        message: string,
        sentAt: Date
    ) {
        this.id = id;
        this.parcelId = parcelId;
        this.userId = userId;
        this.message = message;
        this.sentAt = sentAt;
    }
}
