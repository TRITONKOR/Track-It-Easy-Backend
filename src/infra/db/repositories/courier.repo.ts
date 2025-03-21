import { couriersTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { Courier } from "../../../domain/entities/courier.entity";
import { db } from "../index";

export class CourierRepository {
    async findById(id: string): Promise<Courier | null> {
        const couriers = await db
            .select()
            .from(couriersTable)
            .where(eq(couriersTable.id, id));
        return new Courier(couriers[0]) || null;
    }

    async findByName(name: string): Promise<Courier | null> {
        const couriers = await db
            .select()
            .from(couriersTable)
            .where(
                eq(couriersTable.name, name as "NovaPoshta" | "MeestExpress")
            );
        return new Courier(couriers[0]) || null;
    }

    async findAll(): Promise<Courier[] | null> {
        const couriers = await db.select().from(couriersTable);
        return couriers.map((courier) => new Courier(courier));
    }

    async create(courier: typeof couriersTable.$inferInsert): Promise<Courier> {
        const [newCourier] = await db
            .insert(couriersTable)
            .values(courier)
            .returning();
        return new Courier(newCourier);
    }

    async update(
        id: string,
        updatedFields: Partial<typeof couriersTable.$inferInsert>
    ): Promise<Courier | null> {
        const [updatedCourier] = await db
            .update(couriersTable)
            .set({ ...updatedFields, updatedAt: new Date() })
            .where(eq(couriersTable.id, id))
            .returning();
        return new Courier(updatedCourier) || null;
    }

    async delete(id: string): Promise<void> {
        await db.delete(couriersTable).where(eq(couriersTable.id, id));
    }
}
