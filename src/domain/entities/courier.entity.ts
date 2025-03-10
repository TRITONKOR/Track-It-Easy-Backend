import { couriersTable } from "@db/schema";
import { InferSelectModel } from "drizzle-orm";

export class Courier {
    id: string;
    name: string;
    api: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(courier: InferSelectModel<typeof couriersTable>) {
        this.id = courier.id;
        this.name = courier.name;
        this.api = courier.api;
        this.createdAt = courier.createdAt;
        this.updatedAt = courier.updatedAt;
    }

    setName(name: string): void {
        this.name = name;
    }

    setApi(api: string): void {
        this.api = api;
    }
}
