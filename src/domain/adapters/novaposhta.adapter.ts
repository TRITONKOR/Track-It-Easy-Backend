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

    async trackParcel(trackingNumber: string): Promise<ITrackingResponse> {
        try {
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

            const parcelData = response.data?.data?.[0];

            if (!parcelData) {
                console.log("dgdfgdfgfdgfdd");
                return { success: false, error: "Tracking info not found" };
            }

            return {
                success: true,
                data: {
                    trackingNumber,
                    status: this.mapStatus(parcelData.Status),
                    fromLocation: parcelData.WarehouseSenderAddress,
                    toLocation: parcelData.WarehouseRecipientAddress,
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
