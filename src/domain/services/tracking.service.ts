import { ParcelRepository } from "@db/repositories/parcel.repo";
import EventEmitter from "events";
import { MeestExpressAdapter } from "../adapters/meestExpress.adapter";
import { NovaPoshtaAdapter } from "../adapters/novaposhta.adapter";
import { UkrposhtaAdapter } from "../adapters/ukrposhta.adapter";
import { Parcel } from "../entities/parcel.entity";
import { TrackingEvent } from "../entities/trackingEvent.entity";
import { CourierService } from "./courier.service";
import { StatusService } from "./status.service";
import { TrackingEventService } from "./trackingEvent.service";

import { ParcelAlreadyExistsException } from "@/api/errors/httpException";
import { sendStatusUpdateEmail } from "@/utils/mailer";
import { getUsersByFollowedParcel } from "@db/repositories/followedParcels.repo";
import nodeCron from "node-cron";

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
        courier: string;
        factualWeight: string;
        fromLocation?: string;
        toLocation?: string;
        isFollowed?: boolean;
        movementHistory?: IMovementEvent[];
        lastUpdated?: string;
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
    private updateInterval: string;
    private eventEmitter: EventEmitter;
    private updateInProgress = false;
    private updateTimeout?: NodeJS.Timeout;
    private backgroundUpdateJob: any = null;

    private readonly FINAL_STATUSES = [
        "Доставлено",
        "Повернуто",
        "Втрачено",
        "Скасовано",
    ];

    constructor(
        parcelRepository: ParcelRepository,
        courierService: CourierService,
        statusService: StatusService,
        trackingEventService: TrackingEventService,
        novaPoshtaAdapter: NovaPoshtaAdapter,
        meestExpressAdapter: MeestExpressAdapter,
        ukrposhtaAdapter: UkrposhtaAdapter,
        updateIntervalMs: string = "0 * * * *"
    ) {
        this.parcelRepository = parcelRepository;
        this.courierService = courierService;
        this.statusService = statusService;
        this.trackingEventService = trackingEventService;
        this.updateInterval = updateIntervalMs;
        this.eventEmitter = new EventEmitter();
        this.startBackgroundUpdates();

        this.adapters = new Map<string, ICourierAdapter>([
            ["NovaPoshta", novaPoshtaAdapter],
            ["Ukrposhta", ukrposhtaAdapter],
            ["MeestExpress", meestExpressAdapter],
        ]);
    }

    private startBackgroundUpdates() {
        console.log(
            `Starting background updates with interval: ${this.updateInterval}`
        );

        if (this.backgroundUpdateJob) {
            this.backgroundUpdateJob.stop();
            console.log("Stopped previous background update job");
        }

        try {
            this.backgroundUpdateJob = nodeCron.schedule(
                this.updateInterval,
                async () => {
                    console.log(
                        "Cron job triggered at",
                        new Date().toISOString()
                    );

                    if (this.updateInProgress) {
                        console.log("Update already in progress, skipping...");
                        return;
                    }

                    try {
                        this.updateInProgress = true;
                        console.log("Starting parcels update...");
                        await this.updateFollowedParcels();
                    } catch (error) {
                        console.error("Background update error:", error);
                    } finally {
                        this.updateInProgress = false;
                        console.log(
                            "Update completed at",
                            new Date().toISOString()
                        );
                    }
                },
                { timezone: "UTC" }
            );

            console.log("Background updates started successfully");
        } catch (e) {
            console.error("Failed to create CronJob:", e);
        }
    }

    stop() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
        if (this.backgroundUpdateJob) {
            this.backgroundUpdateJob.stop();
        }
    }

    private async updateFollowedParcels() {
        try {
            const uniqueParcels =
                await this.parcelRepository.findAllFollowedParcels();
            console.log(`Found ${uniqueParcels.length} followed parcels...`);

            let activeCount = 0;

            for (const parcel of uniqueParcels) {
                try {
                    const status = (
                        await this.statusService.findById(parcel.statusId)
                    ).name;
                    if (status && this.FINAL_STATUSES.includes(status)) {
                        continue;
                    }

                    activeCount++;
                    await this.updateSingleParcel(parcel);
                } catch (error) {
                    console.error(
                        `Failed to update parcel ${parcel.trackingNumber}:`,
                        error
                    );
                }
            }

            console.log(
                `Updated ${activeCount} active parcels (${
                    uniqueParcels.length - activeCount
                } skipped with final status)`
            );
        } catch (error) {
            console.error("Error fetching followed parcels:", error);
        }
    }

    private async updateSingleParcel(parcel: Parcel) {
        if (!parcel.courierId) return;

        const status = (await this.statusService.findById(parcel.statusId))
            .name;
        if (status && this.FINAL_STATUSES.includes(status)) {
            return;
        }

        const courier = await this.courierService.findById(parcel.courierId);
        const adapter = this.adapters.get(courier.name);
        if (!adapter) return;

        try {
            const result = await adapter.trackParcel(parcel.trackingNumber);
            if (!result.success || !result.data) return;

            const status = await this.statusService.findByName(
                result.data.status
            );

            const updatedParcel = await this.parcelRepository.update(
                parcel.id,
                {
                    statusId: status.id,
                    fromLocation: result.data.fromLocation,
                    toLocation: result.data.toLocation,
                    factualWeight: result.data.factualWeight,
                    updatedAt: new Date(),
                }
            );

            if (!updatedParcel) return;

            const newEvents =
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

            const oldEvents =
                (await this.trackingEventService.findByParcelId(parcel.id)) ||
                [];
            const lastOldEvent =
                oldEvents.length > 0 ? oldEvents[oldEvents.length - 1] : null;
            const lastNewEvent =
                newEvents.length > 0 ? newEvents[newEvents.length - 1] : null;
            if (
                lastNewEvent &&
                lastOldEvent &&
                lastNewEvent.statusLocation !== lastOldEvent.statusLocation
            ) {
                console.log(
                    `[NOTIFY] Parcel ${parcel.trackingNumber}: statusLocation changed from '${lastOldEvent.statusLocation}' to '${lastNewEvent.statusLocation}'. Sending emails to followers...`
                );
                const users = await getUsersByFollowedParcel(parcel.id);
                for (const user of users) {
                    if (user.email) {
                        console.log(
                            `[EMAIL] Sending status update to ${user.email} for parcel ${parcel.trackingNumber} (status: ${lastNewEvent.rawStatus}, location: ${lastNewEvent.statusLocation})`
                        );
                        await sendStatusUpdateEmail(
                            user.email,
                            parcel.trackingNumber,
                            lastNewEvent.rawStatus,
                            lastNewEvent.statusLocation
                        );
                    }
                }
            }

            await this.trackingEventService.checkAndUpdateTrackingEvents(
                parcel.id,
                newEvents
            );

            this.eventEmitter.emit("parcelUpdated", {
                trackingNumber: parcel.trackingNumber,
                status: result.data.status,
                parcelId: parcel.id,
            });

            if (this.isFinalStatus(result.data.status)) {
                this.eventEmitter.emit("parcelCompleted", {
                    trackingNumber: parcel.trackingNumber,
                    status: result.data.status,
                    parcelId: parcel.id,
                });
            }

            console.log(`Parcel ${parcel.trackingNumber} updated successfully`);
        } catch (error) {
            console.error(
                `Error updating parcel ${parcel.trackingNumber} from courier:`,
                error
            );
            throw error;
        }
    }

    private isFinalStatus(status: string): boolean {
        const finalStatuses = ["Доставлено", "Повернуто"];
        return finalStatuses.includes(status);
    }

    async trackParcel(
        trackingNumber: string,
        userId?: string
    ): Promise<ITrackingResponse> {
        const parcel = await this.parcelRepository.findByTrackingNumber(
            trackingNumber
        );

        if (parcel) {
            if (!userId) {
                throw new ParcelAlreadyExistsException();
            }
            return this.getParcelDataFromDb(parcel, userId);
        }

        return this.trackNewParcel(trackingNumber, userId);
    }

    private async getParcelDataFromDb(
        parcel: Parcel,
        userId?: string
    ): Promise<ITrackingResponse> {
        try {
            const status = await this.statusService.findById(parcel.statusId);
            const events = await this.trackingEventService.findByParcelId(
                parcel.id
            );

            return {
                success: true,
                data: {
                    trackingNumber: parcel.trackingNumber,
                    status: status.name,
                    courier: (
                        await this.courierService.findById(parcel.courierId)
                    ).name,
                    factualWeight: parcel.factualWeight,
                    fromLocation: parcel.fromLocation,
                    toLocation: parcel.toLocation,
                    isFollowed: userId
                        ? await this.parcelRepository.isParcelFollowedByUserId(
                              userId,
                              parcel.id
                          )
                        : false,
                    movementHistory: events
                        ? events.map((event) => ({
                              statusLocation: event.statusLocation,
                              description: event.rawStatus,
                              timestamp: event.timestamp.toISOString(),
                          }))
                        : [],
                    lastUpdated: parcel.updatedAt.toISOString(),
                },
            };
        } catch (error) {
            console.error("Error getting parcel data from DB:", error);
            return {
                success: false,
                error: "Failed to get parcel data",
            };
        }
    }

    private async trackNewParcel(
        trackingNumber: string,
        userId?: string
    ): Promise<ITrackingResponse> {
        for (const [courierName, adapter] of this.adapters.entries()) {
            try {
                const result = await adapter.trackParcel(trackingNumber);

                if (result.success && result.data) {
                    const courier = await this.courierService.findByName(
                        courierName
                    );
                    const status = await this.statusService.findByName(
                        result.data.status
                    );

                    const newParcel = await this.parcelRepository.create({
                        id: crypto.randomUUID(),
                        trackingNumber,
                        courierId: courier.id,
                        statusId: status.id,
                        fromLocation: result.data.fromLocation,
                        toLocation: result.data.toLocation,
                        factualWeight: result.data.factualWeight,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    });

                    if (!newParcel) continue;

                    const events =
                        result.data.movementHistory?.map(
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

                    await this.trackingEventService.create(events);

                    return {
                        ...result,
                        data: {
                            ...result.data,
                            isFollowed: userId
                                ? await this.parcelRepository.isParcelFollowedByUserId(
                                      userId,
                                      newParcel.id
                                  )
                                : false,
                            lastUpdated: new Date().toISOString(),
                        },
                    };
                }
            } catch (error) {
                console.error(
                    `Error tracking new parcel with ${courierName}:`,
                    error
                );
            }
        }

        return {
            success: false,
            error: "Parcel not found in any courier service",
        };
    }

    async refreshParcel(trackingNumber: string): Promise<ITrackingResponse> {
        try {
            const parcel = await this.parcelRepository.findByTrackingNumber(
                trackingNumber
            );
            if (!parcel) {
                return {
                    success: false,
                    error: "Parcel not found",
                };
            }

            await this.updateSingleParcel(parcel);
            return this.getParcelDataFromDb(parcel);
        } catch (error) {
            console.error("Error refreshing parcel:", error);
            return {
                success: false,
                error: "Failed to refresh parcel data",
            };
        }
    }

    onParcelUpdate(
        parcelId: string,
        callback: (data: {
            trackingNumber: string;
            status: string;
            parcelId: string;
            completed?: boolean;
        }) => void
    ) {
        const updateListener = (data: {
            trackingNumber: string;
            status: string;
            parcelId: string;
        }) => {
            if (data.parcelId === parcelId) {
                callback(data);
            }
        };

        const completeListener = (data: {
            trackingNumber: string;
            status: string;
            parcelId: string;
        }) => {
            if (data.parcelId === parcelId) {
                callback({ ...data, completed: true });
                this.eventEmitter.off("parcelUpdated", updateListener);
                this.eventEmitter.off("parcelCompleted", completeListener);
            }
        };

        this.eventEmitter.on("parcelUpdated", updateListener);
        this.eventEmitter.on("parcelCompleted", completeListener);

        return () => {
            this.eventEmitter.off("parcelUpdated", updateListener);
            this.eventEmitter.off("parcelCompleted", completeListener);
        };
    }
}
