import { ParcelRepository } from "@db/repositories/parcel.repo";
import { MeestExpressAdapter } from "../adapters/meestExpress.adapter";
import { NovaPoshtaAdapter } from "../adapters/novaposhta.adapter";
import { CourierService } from "./courier.service";
import { StatusService } from "./status.service";

export interface ICourierAdapter {
    trackParcel(trackingNumber: string): Promise<ITrackingResponse>;
}

export interface ITrackingResponse {
    success: boolean;
    data?: {
        trackingNumber: string;
        status: string;
        fromLocation?: string;
        toLocation?: string;
    };
    error?: string;
}

export class TrackingService {
    private adapters: Map<
        string,
        { trackParcel: (trackingNumber: string) => Promise<any> }
    >;
    private parcelRepository;
    private courierService;
    private statusService;

    constructor(
        parcelRepository: ParcelRepository,
        courierService: CourierService,
        statusService: StatusService,
        novaPoshtaAdapter: NovaPoshtaAdapter,
        meestExpressAdapter: MeestExpressAdapter
    ) {
        this.parcelRepository = parcelRepository;
        this.courierService = courierService;
        this.statusService = statusService;
        this.adapters = new Map<string, ICourierAdapter>([
            ["NovaPoshta", novaPoshtaAdapter],
            //["MeestExpress", meestExpressAdapter],
        ]);
    }

    async trackParcel(trackingNumber: string) {
        let parcel = await this.parcelRepository.findByTrackingNumber(
            trackingNumber
        );

        if (parcel && parcel?.courierId) {
            const courier = await this.courierService.findById(
                parcel.courierId
            );

            if (this.adapters.has(courier.name)) {
                console.log(
                    `Tracking parcel ${trackingNumber} with courier ${courier.name}`
                );
                return this.adapters
                    .get(courier.name)!
                    .trackParcel(trackingNumber);
            }
        }

        // Якщо посилки немає в БД, перевіряємо всі адаптери
        for (const [courierName, adapter] of this.adapters.entries()) {
            try {
                const result = await adapter.trackParcel(trackingNumber);

                if (result?.success && result.data) {
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

                    return result;
                }
            } catch (error) {
                console.warn(`Tracking failed for ${courierName}: `);
            }
        }

        throw new Error("Parcel not found in any courier service");
    }
}
