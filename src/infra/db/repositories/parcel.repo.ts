import {
    couriersTable,
    followedParcelsTable,
    parcelsTable,
    statusesTable,
} from "@db/schema";
import { and, eq } from "drizzle-orm";
import { Parcel } from "../../../domain/entities/parcel.entity";
import { db } from "../index";

export class ParcelRepository {
    async findById(id: string): Promise<Parcel | null> {
        const parcels = await db
            .select()
            .from(parcelsTable)
            .where(eq(parcelsTable.id, id));

        if (!parcels.length) return null;

        return new Parcel(parcels[0]) || null;
    }

    async findAll(): Promise<Parcel[]> {
        const parcels = await db.select().from(parcelsTable);
        return parcels.map((p) => new Parcel(p));
    }

    async findByTrackingNumber(trackingNumber: string): Promise<Parcel | null> {
        const parcels = await db
            .select()
            .from(parcelsTable)
            .where(eq(parcelsTable.trackingNumber, trackingNumber));

        if (!parcels.length) return null;

        return new Parcel(parcels[0]) || null;
    }

    async findByUserId(userId: string): Promise<Parcel[]> {
        const parcels = await db
            .select({
                id: parcelsTable.id,
                trackingNumber: parcelsTable.trackingNumber,
                courierId: parcelsTable.courierId,
                courier: couriersTable.name,
                statusId: parcelsTable.statusId,
                status: statusesTable.name,
                fromLocation: parcelsTable.fromLocation,
                toLocation: parcelsTable.toLocation,
                factualWeight: parcelsTable.factualWeight,
                createdAt: parcelsTable.createdAt,
                updatedAt: parcelsTable.updatedAt,
            })
            .from(followedParcelsTable)
            .innerJoin(
                parcelsTable,
                eq(followedParcelsTable.parcelId, parcelsTable.id)
            )
            .innerJoin(
                couriersTable,
                eq(parcelsTable.courierId, couriersTable.id)
            )
            .innerJoin(
                statusesTable,
                eq(parcelsTable.statusId, statusesTable.id)
            )
            .where(eq(followedParcelsTable.userId, userId));

        if (!parcels.length) return [];

        return parcels.map((p) => new Parcel(p));
    }

    async isParcelFollowedByUserId(
        userId: string,
        parcelId: string
    ): Promise<boolean> {
        const parcels = await db
            .select()
            .from(followedParcelsTable)
            .innerJoin(
                parcelsTable,
                eq(followedParcelsTable.parcelId, parcelsTable.id)
            )
            .where(
                and(
                    eq(followedParcelsTable.userId, userId),
                    eq(followedParcelsTable.parcelId, parcelId)
                )
            );
        return parcels.length > 0;
    }

    async followParcel(userId: string, parcelId: string): Promise<void> {
        if (await this.isParcelFollowedByUserId(userId, parcelId)) {
            throw new Error("Parcel already followed");
        }

        await db.insert(followedParcelsTable).values({
            id: crypto.randomUUID(),
            userId,
            parcelId,
        });
    }

    async unfollowParcel(userId: string, parcelId: string): Promise<void> {
        await db
            .delete(followedParcelsTable)
            .where(
                and(
                    eq(followedParcelsTable.userId, userId),
                    eq(followedParcelsTable.parcelId, parcelId)
                )
            );
    }

    async findAllFollowedParcels(): Promise<Parcel[]> {
        const result = await db
            .selectDistinctOn([parcelsTable.id], {
                id: parcelsTable.id,
                trackingNumber: parcelsTable.trackingNumber,
                courierId: parcelsTable.courierId,
                courier: couriersTable.name,
                statusId: parcelsTable.statusId,
                status: statusesTable.name,
                fromLocation: parcelsTable.fromLocation,
                toLocation: parcelsTable.toLocation,
                createdAt: parcelsTable.createdAt,
                updatedAt: parcelsTable.updatedAt,
                factualWeight: parcelsTable.factualWeight,
            })
            .from(followedParcelsTable)
            .innerJoin(
                parcelsTable,
                eq(followedParcelsTable.parcelId, parcelsTable.id)
            )
            .innerJoin(
                couriersTable,
                eq(parcelsTable.courierId, couriersTable.id)
            )
            .innerJoin(
                statusesTable,
                eq(parcelsTable.statusId, statusesTable.id)
            )
            .execute();

        return result.map((p) => new Parcel(p));
    }

    async create(
        parcel: typeof parcelsTable.$inferInsert
    ): Promise<Parcel | null> {
        const [newParcel] = await db
            .insert(parcelsTable)
            .values(parcel)
            .returning();

        if (!newParcel) return null;

        return new Parcel(newParcel);
    }

    async update(
        id: string,
        updatedFields: Partial<typeof parcelsTable.$inferInsert>
    ): Promise<Parcel | null> {
        const [updatedParcel] = await db
            .update(parcelsTable)
            .set({ ...updatedFields, updatedAt: new Date() })
            .where(eq(parcelsTable.id, id))
            .returning();

        if (!updatedParcel) return null;

        return new Parcel(updatedParcel) || null;
    }

    async delete(id: string): Promise<void> {
        await db.delete(parcelsTable).where(eq(parcelsTable.id, id));
    }
}
