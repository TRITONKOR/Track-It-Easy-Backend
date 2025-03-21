import { statusesTable } from "@db/schema";
import { InferSelectModel } from "drizzle-orm";

export class Status {
    id: string;
    name: string;
    description: string;
    createdAt: Date;

    constructor(status: InferSelectModel<typeof statusesTable>) {
        this.id = status.id;
        this.name = status.name;
        this.description = status.description;
        this.createdAt = status.createdAt;
    }
}
