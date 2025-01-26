import axios from "axios";

export class NovaPoshtaAdapter {
    private baseUrl = "http://localhost:3001";

    async getTrackingInfo(trackingNumber: string) {
        try {
            console.log("Novaposhta");
            const response = await axios.get(
                `${this.baseUrl}/mock/novaposhta/tracking/${trackingNumber}`
            );
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
