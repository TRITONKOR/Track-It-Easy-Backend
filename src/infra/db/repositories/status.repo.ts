import { Status } from "@/domain/entities/status.entity";
import { statusesTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { db } from "../index";

export class StatusRepository {
    async findById(id: string): Promise<Status | null> {
        const statuses = await db
            .select()
            .from(statusesTable)
            .where(eq(statusesTable.id, id));
        return new Status(statuses[0]) || null;
    }

    async findByName(name: string): Promise<Status | null> {
        const statuses = await db
            .select()
            .from(statusesTable)
            .where(eq(statusesTable.name, name));
        return new Status(statuses[0]) || null;
    }

    async findAll(): Promise<Status[] | null> {
        const statuses = await db.select().from(statusesTable);
        return statuses.map((status) => new Status(status));
    }

    async create(courier: typeof statusesTable.$inferInsert): Promise<Status> {
        const [newStatus] = await db
            .insert(statusesTable)
            .values(courier)
            .returning();
        return new Status(newStatus);
    }

    async update(
        id: string,
        updatedFields: Partial<typeof statusesTable.$inferInsert>
    ): Promise<Status | null> {
        const [updatedStatus] = await db
            .update(statusesTable)
            .set({ ...updatedFields })
            .where(eq(statusesTable.id, id))
            .returning();
        return new Status(updatedStatus) || null;
    }

    async delete(id: string): Promise<void> {
        await db.delete(statusesTable).where(eq(statusesTable.id, id));
    }
}
