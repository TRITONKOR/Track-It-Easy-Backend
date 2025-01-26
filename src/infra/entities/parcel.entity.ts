import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Courier } from "./courier.entity";
import { Notification } from "./notification.entity";
import { Status } from "./status.entity";
import { TrackingEvent } from "./tracking_event.entity";
import { User } from "./user.entity";

@Entity()
export class Parcel {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    trackingNumber: string;

    @Column({ type: "uuid", nullable: false })
    userId: string;

    @Column({ type: "uuid", nullable: false })
    statusId: string;

    @Column({ type: "uuid", nullable: false })
    courierId: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.parcels, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;

    @ManyToOne(() => Status, (status) => status.parcels, {
        onDelete: "SET NULL",
    })
    @JoinColumn({ name: "statusId" })
    status: Status;

    @ManyToOne(() => Courier, (courier) => courier.parcels, {
        onDelete: "SET NULL",
    })
    @JoinColumn({ name: "courierId" })
    courier: Courier;

    @OneToMany(() => Notification, (notification) => notification.parcel)
    notifications: Notification[];

    @OneToMany(() => TrackingEvent, (trackingEvent) => trackingEvent.parcel)
    trackingEvents: TrackingEvent[];
}
