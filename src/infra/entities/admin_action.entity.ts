import { ActionType } from "src/utils/ActionType";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class AdminAction {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid", nullable: false })
    userId: string;

    @Column({ type: "enum", enum: ActionType })
    actionType: ActionType;

    @Column({ type: "varchar", length: 255, nullable: false })
    description: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.adminActions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user: User;
}
