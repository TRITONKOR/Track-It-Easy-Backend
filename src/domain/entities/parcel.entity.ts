import { parcelsTable } from "@db/schema";
import { InferSelectModel } from "drizzle-orm";

export class Parcel {
    id: string;
    trackingNumber: string;
    statusId: string;
    courierId: string;
    fromLocation: string;
    toLocation: string;
    factualWeight: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(parcel: InferSelectModel<typeof parcelsTable>) {
        this.id = parcel.id;
        this.trackingNumber = parcel.trackingNumber;
        this.statusId = parcel.statusId;
        this.courierId = parcel.courierId;
        this.fromLocation = parcel.fromLocation;
        this.toLocation = parcel.toLocation;
        this.factualWeight = parcel.factualWeight;
        this.createdAt = parcel.createdAt;
        this.updatedAt = parcel.updatedAt;
    }

    setStatusId(statusId: string): void {
        this.statusId = statusId;
    }

    getId(): string {
        return this.id;
    }
}
