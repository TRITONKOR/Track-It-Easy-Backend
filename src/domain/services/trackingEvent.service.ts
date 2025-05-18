import { HttpException } from "@/api/errors/httpException";
import { TrackingEventRepository } from "@db/repositories/trackingEvent.repo";
import { trackingEventsTable } from "@db/schema";
import { TrackingEvent } from "../entities/trackingEvent.entity";

export class TrackingEventService {
    private trackingEventRepository: TrackingEventRepository;

    constructor(trackingEventRepository: TrackingEventRepository) {
        this.trackingEventRepository = trackingEventRepository;
    }

    async findById(id: string): Promise<TrackingEvent | null> {
        try {
            const trackingEvent = await this.trackingEventRepository.findById(
                id
            );
            if (!trackingEvent) {
                throw new HttpException(404, "Tracking event not found");
            }
            return trackingEvent;
        } catch (error) {
            throw new HttpException(500, "Error finding Tracking event");
        }
    }

    async findByParcelId(parcelId: string): Promise<TrackingEvent[] | null> {
        try {
            const trackingEvents =
                await this.trackingEventRepository.findAllByParcelId(parcelId);
            if (!trackingEvents) {
                throw new HttpException(
                    404,
                    "Tracking events not found with the provided tracking number"
                );
            }
            return trackingEvents;
        } catch (error) {
            throw new HttpException(
                500,
                "Error finding tracking events by tracking number"
            );
        }
    }

    async findAll(): Promise<TrackingEvent[]> {
        try {
            const trackingEvents = await this.trackingEventRepository.findAll();
            return trackingEvents;
        } catch (error) {
            throw new HttpException(
                500,
                "Error retrieving all tracking events"
            );
        }
    }

    async checkAndUpdateTrackingEvents(
        parcelId: string,
        trackingEventsFromRequest: TrackingEvent[]
    ): Promise<TrackingEvent[]> {
        try {
            const trackingEventsFromDb =
                await this.trackingEventRepository.findAllByParcelId(parcelId);
            if (!trackingEventsFromDb || trackingEventsFromDb.length === 0) {
                try {
                    trackingEventsFromRequest.forEach(
                        (event: TrackingEvent) => {
                            this.create(event);
                        }
                    );
                    return trackingEventsFromRequest;
                } catch (error) {
                    throw new HttpException(
                        500,
                        "Error saving new tracking events"
                    );
                }
            }

            const sortedEventsFromDb = trackingEventsFromDb.sort(
                (a, b) => a.timestamp!.getTime() - b.timestamp!.getTime()
            );
            const sortedEventsFromRequest = trackingEventsFromRequest.sort(
                (a, b) => a.timestamp!.getTime() - b.timestamp!.getTime()
            );

            if (sortedEventsFromDb.length !== sortedEventsFromRequest.length) {
                throw new HttpException(
                    400,
                    "Mismatch in the number of tracking events between request and database"
                );
            }

            const updatedTrackingEvents: TrackingEvent[] = [];

            for (let i = 0; i < sortedEventsFromDb.length; i++) {
                const eventFromDb = sortedEventsFromDb[i];
                const eventFromRequest = sortedEventsFromRequest[i];

                if (
                    eventFromDb.statusLocation !==
                    eventFromRequest.statusLocation
                ) {
                    const updatedEvent =
                        await this.trackingEventRepository.update(
                            eventFromDb.id,
                            {
                                statusLocation: eventFromRequest.statusLocation,
                            }
                        );

                    if (!updatedEvent) {
                        throw new HttpException(
                            500,
                            `Failed to update tracking event with ID: ${eventFromDb.id}`
                        );
                    }

                    updatedTrackingEvents.push(updatedEvent);
                }
            }

            return [...updatedTrackingEvents];
        } catch (error) {
            throw new HttpException(
                500,
                "Error processing tracking events comparison and update"
            );
        }
    }

    async create(
        trackingEvent: typeof trackingEventsTable.$inferInsert
    ): Promise<TrackingEvent> {
        try {
            const createdTrackingEvent =
                await this.trackingEventRepository.create(trackingEvent);
            if (!createdTrackingEvent) {
                throw new HttpException(500, "Error creating trackingEvent");
            }
            return createdTrackingEvent;
        } catch (error) {
            throw new HttpException(500, "Error creating trackingEvent");
        }
    }

    async update(
        id: string,
        updatedFields: Partial<typeof TrackingEventRepository.prototype.update>
    ): Promise<TrackingEvent | null> {
        try {
            const updatedTrackingEvent =
                await this.trackingEventRepository.update(id, updatedFields);
            if (!updatedTrackingEvent) {
                throw new HttpException(
                    404,
                    "Tracking event not found for update"
                );
            }
            return updatedTrackingEvent;
        } catch (error) {
            throw new HttpException(500, "Error updating tracking event");
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await this.trackingEventRepository.delete(id);
        } catch (error) {
            throw new HttpException(500, "Error deleting tracking event");
        }
    }
}
