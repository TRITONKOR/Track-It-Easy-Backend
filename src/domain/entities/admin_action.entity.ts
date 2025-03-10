import { adminActionsTable } from "@db/schema";
import { InferSelectModel } from "drizzle-orm";
import { ActionType } from "src/utils/ActionType";

export class AdminAction {
    id: string;
    userId: string;
    actionType: ActionType;
    description: string;
    createdAt: Date;

    constructor(action: InferSelectModel<typeof adminActionsTable>) {
        this.id = action.id;
        this.userId = action.userId;
        this.actionType = action.actionType as ActionType;
        this.description = action.description;
        this.createdAt = action.createdAt;
    }

    isBanAction(): boolean {
        return this.actionType === "ban user";
    }

    isUnbanAction(): boolean {
        return this.actionType === "unban user";
    }

    isParcelUpdateAction(): boolean {
        return this.actionType === "update parcel";
    }
}
