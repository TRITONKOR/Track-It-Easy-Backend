import axios from "axios";
import { ICourierAdapter } from "../services/tracking.service";

export class MeestExpressAdapter implements ICourierAdapter {
    private baseUrl = "http://localhost:3001";

    async trackParcel(trackingNumber: string) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/mock/ukrposhta/tracking/${trackingNumber}`
            );
            return response.data;
        } catch (error) {
            console.error(
                "Error fetching tracking info from UkrPoshta:",
                error
            );
            throw new Error("Failed to fetch tracking info from UkrPoshta");
        }
    }
}
