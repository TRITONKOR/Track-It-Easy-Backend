import { ParcelRepository } from "@db/repositories/parcel.repo";
import { MeestExpressAdapter } from "../adapters/meestExpress.adapter";
import { NovaPoshtaAdapter } from "../adapters/novaposhta.adapter";
import { TrackingEvent } from "../entities/trackingEvent.entity";
import { CourierService } from "./courier.service";
import { StatusService } from "./status.service";
import { TrackingEventService } from "./trackingEvent.service";

export interface ICourierAdapter {
    trackParcel(trackingNumber: string): Promise<ITrackingResponse>;
}

export interface IMovementEvent {
    statusLocation: string;
    description: string;
    timestamp: string;
}

export interface ITrackingResponse {
    success: boolean;
    data?: {
        trackingNumber: string;
        status: string;
        factualWeight: number;
        fromLocation?: string;
        toLocation?: string;
        isFollowed?: boolean;
        movementHistory?: IMovementEvent[];
    };
    error?: string;
}

export class TrackingService {
    private adapters: Map<
        string,
        {
            trackParcel: (trackingNumber: string) => Promise<any>;
        }
    >;
    private parcelRepository;
    private courierService;
    private statusService;
    private trackingEventService;

    constructor(
        parcelRepository: ParcelRepository,
        courierService: CourierService,
        statusService: StatusService,
        trackingEventService: TrackingEventService,
        novaPoshtaAdapter: NovaPoshtaAdapter,
        meestExpressAdapter: MeestExpressAdapter
    ) {
        this.parcelRepository = parcelRepository;
        this.courierService = courierService;
        this.statusService = statusService;
        this.trackingEventService = trackingEventService;
        this.adapters = new Map<string, ICourierAdapter>([
            ["NovaPoshta", novaPoshtaAdapter],
            //["MeestExpress", meestExpressAdapter],
        ]);
    }

    async trackParcel(trackingNumber: string, userId?: string) {
        let parcel = await this.parcelRepository.findByTrackingNumber(
            trackingNumber
        );

        if (parcel && parcel.courierId) {
            const courier = await this.courierService.findById(
                parcel.courierId
            );
            try {
                if (this.adapters.has(courier.name)) {
                    console.log(
                        `Tracking parcel ${trackingNumber} with courier ${courier.name}`
                    );
                    const result = await this.adapters
                        .get(courier.name)!
                        .trackParcel(trackingNumber);

                    if (result.success && result.data) {
                        if (userId) {
                            result.data.isFollowed =
                                await this.parcelRepository.isParcelFollowedByUserId(
                                    userId,
                                    trackingNumber
                                );
                        }

                        const trackingEventsFromRequest =
                            result.data.movementHistory?.map(
                                (event: IMovementEvent) =>
                                    new TrackingEvent({
                                        id: crypto.randomUUID(),
                                        parcelId: parcel.id,
                                        statusLocation: event.statusLocation,
                                        rawStatus: event.description,
                                        timestamp: new Date(event.timestamp),
                                        createdAt: new Date(),
                                        isNotified: false,
                                    })
                            ) || [];

                        await this.trackingEventService.checkAndUpdateTrackingEvents(
                            parcel.id,
                            trackingEventsFromRequest
                        );
                    }

                    return result;
                }
            } catch (error) {
                console.warn(`Tracking failed for ${courier.name}: `);
            }
        }

        for (const [courierName, adapter] of this.adapters.entries()) {
            try {
                const result = await adapter.trackParcel(trackingNumber);

                if (result?.success && result.data) {
                    result.data.isFollowed = false;
                    const parcelData = result.data;

                    const newParcel = {
                        id: crypto.randomUUID(),
                        trackingNumber,
                        courierId: await (
                            await this.courierService.findByName(courierName)
                        ).id,
                        statusId: await (
                            await this.statusService.findByName(
                                parcelData.status
                            )
                        ).id,
                        status: parcelData.status,
                        fromLocation: parcelData.fromLocation,
                        toLocation: parcelData.toLocation,
                    };

                    await this.parcelRepository.create(newParcel);
                    console.log(`Parcel ${trackingNumber} saved to DB.`);

                    const trackingEventsFromRequest =
                        parcelData.movementHistory?.map(
                            (event: IMovementEvent) =>
                                new TrackingEvent({
                                    id: crypto.randomUUID(),
                                    parcelId: newParcel.id,
                                    statusLocation: event.statusLocation,
                                    rawStatus: event.description,
                                    timestamp: new Date(event.timestamp),
                                    createdAt: new Date(),
                                    isNotified: false,
                                })
                        ) || [];

                    await this.trackingEventService.checkAndUpdateTrackingEvents(
                        newParcel.id,
                        trackingEventsFromRequest
                    );

                    return result;
                }
            } catch (error) {
                console.warn(`Tracking failed for ${courierName}: `);
            }
        }

        throw new Error("Parcel not found in any courier service");
    }
}
