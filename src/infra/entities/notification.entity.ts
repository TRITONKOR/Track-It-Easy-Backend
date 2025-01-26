import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Parcel } from "./parcel.entity";
import { User } from "./user.entity";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", nullable: false })
    parcelId: string;

    @Column({ type: "uuid", nullable: false })
    userId: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    message: string;

    @Column({ type: "date", nullable: false })
    sentAt: Date;

    @ManyToOne(() => Parcel, (parcel) => parcel.notifications, {
        onDelete: "CASCADE",
    })
    parcel: Parcel;

    @ManyToOne(() => User, (user) => user.notifications, {
        onDelete: "CASCADE",
    })
    user: User;
}
