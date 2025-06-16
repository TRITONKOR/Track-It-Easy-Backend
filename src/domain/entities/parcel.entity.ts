import { parcelsTable } from "@db/schema";
import { InferSelectModel } from "drizzle-orm";

export class Parcel {
    id: string;
    trackingNumber: string;
    statusId: string;
    status?: string;
    courierId: string;
    courier?: string;
    fromLocation: string;
    toLocation: string;
    factualWeight: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(
        parcel: InferSelectModel<typeof parcelsTable> & { courier?: string } & {
            status?: string;
        }
    ) {
        this.id = parcel.id;
        this.trackingNumber = parcel.trackingNumber;
        this.statusId = parcel.statusId;
        this.status = parcel.status;
        this.courierId = parcel.courierId;
        this.courier = parcel.courier;
        this.fromLocation = parcel.fromLocation;
        this.toLocation = parcel.toLocation;
        this.factualWeight = parcel.factualWeight;
        this.createdAt = parcel.createdAt;
        this.updatedAt = parcel.updatedAt;
    }
}
