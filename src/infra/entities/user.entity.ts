import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../../utils/UserRole";
import { AdminAction } from "./admin_action.entity";
import { Notification } from "./notification.entity";
import { Parcel } from "./parcel.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255, unique: true })
    email: string;

    @Column({ type: "varchar", nullable: true })
    passwordHash: string | null;

    @Column({ type: "enum", enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @OneToMany(() => Parcel, (parcel) => parcel.user)
    parcels: Parcel[];

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];

    @OneToMany(() => AdminAction, (adminAction) => adminAction.user)
    adminActions: AdminAction[];
}
