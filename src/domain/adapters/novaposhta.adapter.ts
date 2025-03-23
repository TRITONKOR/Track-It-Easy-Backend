import axios from "axios";
import { config } from "../../config/config";
import {
    ICourierAdapter,
    ITrackingResponse,
} from "../services/tracking.service";

export class NovaPoshtaAdapter implements ICourierAdapter {
    private baseUrl: string;
    private apiKey: string;

    constructor() {
        this.baseUrl = config.NOVA_POSHTA_API_URL;
        this.apiKey = config.NOVA_POSHTA_API_KEY;
    }

    private mapStatus(apiStatus: string): string {
        const statusMap: Record<string, string> = {
            "Відправлення отримано": "Доставлено",
            "In Transit": "В дорозі",
            Returned: "Повернуто",
            Waiting: "Очікується",
        };

        return statusMap[apiStatus] || "Очікується";
    }

    private async fetchGeneralTrackingInfo(trackingNumber: string) {
        const response = await axios.post(`${this.baseUrl}/v2.0/json/`, {
            apiKey: this.apiKey,
            modelName: "TrackingDocumentGeneral",
            calledMethod: "getStatusDocuments",
            methodProperties: {
                Documents: [
                    {
                        DocumentNumber: trackingNumber,
                        Phone: "",
                    },
                ],
            },
        });

        return response.data?.data?.[0];
    }

    private async fetchMovementHistory(trackingNumber: string) {
        const response = await axios.post(`${this.baseUrl}/v2.0/json/`, {
            apiKey: this.apiKey,
            modelName: "InternetDocument",
            calledMethod: "getDocumentsEWMovement",
            methodProperties: {
                Number: trackingNumber,
                NewFormat: "1",
            },
        });

        const movementData = response.data?.data?.[0]?.movement;
        if (!movementData) {
            return [];
        }

        const mapEvent = (event: any) => ({
            statusLocation: event.StatusLocation,
            description: event.EventDescription,
            timestamp:
                event.ArrivalTime || event.DepartureTime || event.Date || "N/A",
        });

        return [
            ...(movementData.passed || []),
            ...(movementData.now || []),
            ...(movementData.future || []),
        ].map(mapEvent);
    }

    async trackParcel(trackingNumber: string): Promise<ITrackingResponse> {
        try {
            const [parcelData, movementHistory] = await Promise.all([
                this.fetchGeneralTrackingInfo(trackingNumber),
                this.fetchMovementHistory(trackingNumber),
            ]);

            if (!parcelData) {
                return { success: false, error: "Tracking info not found" };
            }

            return {
                success: true,
                data: {
                    trackingNumber,
                    status: this.mapStatus(parcelData.Status),
                    fromLocation: parcelData.WarehouseSenderAddress,
                    toLocation: parcelData.WarehouseRecipientAddress,
                    movementHistory,
                },
            };
        } catch (error) {
            console.error(
                "Error fetching tracking info from Nova Poshta:",
                error
            );
            throw new Error("Failed to fetch tracking info from Nova Poshta");
        }
    }
}
