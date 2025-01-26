import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Parcel } from "./parcel.entity";
import { Status } from "./status.entity";

@Entity()
export class TrackingEvent {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", nullable: false })
    parcelId: string;

    @Column({ type: "uuid", nullable: false })
    statusId: string;

    @Column({ type: "varchar", nullable: false })
    location: string;

    @Column({ type: "boolean", default: false })
    isNotified: boolean;

    @Column({ type: "varchar", nullable: true })
    rawStatus: string;

    @Column({ type: "date", nullable: false })
    timestamp: Date;

    @CreateDateColumn({ type: "date" })
    createdAt: Date;

    @ManyToOne(() => Parcel, (parcel) => parcel.trackingEvents, {
        onDelete: "CASCADE",
    })
    parcel: Parcel;

    @ManyToOne(() => Status, (status) => status.trackingEvents, {
        onDelete: "CASCADE",
    })
    status: Status;
}
