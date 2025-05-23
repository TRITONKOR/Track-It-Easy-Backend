import { TrackingEvent } from "@/domain/entities/trackingEvent.entity";
import { trackingEventsTable } from "@db/schema";
import { eq } from "drizzle-orm";
import { db } from "../index";

export class TrackingEventRepository {
    async findById(id: string): Promise<TrackingEvent | null> {
        const trackingEvents = await db
            .select()
            .from(trackingEventsTable)
            .where(eq(trackingEventsTable.id, id));
        return new TrackingEvent(trackingEvents[0]) || null;
    }

    async findAll(): Promise<TrackingEvent[]> {
        const trackingEvents = await db.select().from(trackingEventsTable);
        return trackingEvents.map((t) => new TrackingEvent(t));
    }

    async findAllByParcelId(parcelId: string): Promise<TrackingEvent[] | null> {
        const trackingEvents = await db
            .select()
            .from(trackingEventsTable)
            .where(eq(trackingEventsTable.parcelId, parcelId));

        return trackingEvents.length
            ? trackingEvents.map((te) => new TrackingEvent(te))
            : [];
    }

    async create(
        parcel: typeof trackingEventsTable.$inferInsert
    ): Promise<TrackingEvent | null> {
        const [newTrackingEvent] = await db
            .insert(trackingEventsTable)
            .values(parcel)
            .returning();

        if (!newTrackingEvent) return null;

        return new TrackingEvent(newTrackingEvent);
    }

    async update(
        id: string,
        updatedFields: Partial<typeof trackingEventsTable.$inferInsert>
    ): Promise<TrackingEvent | null> {
        const [updatedTrackingEvent] = await db
            .update(trackingEventsTable)
            .set({ ...updatedFields })
            .where(eq(trackingEventsTable.id, id))
            .returning();
        return new TrackingEvent(updatedTrackingEvent) || null;
    }

    async delete(id: string): Promise<void> {
        await db
            .delete(trackingEventsTable)
            .where(eq(trackingEventsTable.id, id));
    }
}
