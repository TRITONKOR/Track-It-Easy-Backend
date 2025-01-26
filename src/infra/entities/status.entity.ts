import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Parcel } from "./parcel.entity";
import { TrackingEvent } from "./tracking_event.entity";

@Entity()
export class Status {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    description: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @OneToMany(() => Parcel, (parcel) => parcel.status)
    parcels: Parcel[];

    @OneToMany(() => TrackingEvent, (trackingEvent) => trackingEvent.status)
    trackingEvents: TrackingEvent[];
}
