import axios from "axios";
import { config } from "../../config/config";

export class NovaPoshtaAdapter {
    private baseUrl: string;
    private apiKey: string;

    constructor() {
        this.baseUrl = config.NOVA_POSHTA_API_URL;
        this.apiKey = config.NOVA_POSHTA_API_KEY;
    }

    async trackParcel(trackingNumber: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/v2.0/json/`, {
                apiKey: this.apiKey,
                modelName: "TrackingDocument",
                calledMethod: "getStatusDocuments",
                methodProperties: {
                    Documents: [
                        {
                            DocumentNumber: trackingNumber,
                        },
                    ],
                },
            });
            return response.data;
        } catch (error) {
            console.error(
                "Error fetching tracking info from Nova Poshta:",
                error
            );
            throw new Error("Failed to fetch tracking info from Nova Poshta");
        }
    }
}
