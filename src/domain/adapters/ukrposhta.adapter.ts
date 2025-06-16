import axios from "axios";
import { config } from "../../config/config";
import {
    ICourierAdapter,
    ITrackingResponse,
} from "../services/tracking.service";

export class UkrposhtaAdapter implements ICourierAdapter {
    async trackParcel(trackingNumber: string): Promise<ITrackingResponse> {
        try {
            const response = await axios.get(
                `${config.MOCK_URL}/mock/ukrposhta/tracking/${trackingNumber}`
            );
            if (!response.data.success) {
                return {
                    success: false,
                    error: response.data.error || "Tracking info not found",
                };
            }
            const data = response.data.data;
            return {
                success: true,
                data: {
                    trackingNumber: data.trackingNumber,
                    status: data.status,
                    courier: "Ukrposhta",
                    factualWeight: data.factualWeight,
                    fromLocation: data.fromLocation,
                    toLocation: data.toLocation,
                    isFollowed: data.isFollowed,
                    movementHistory: data.movementHistory,
                    lastUpdated: data.lastUpdated,
                },
            };
        } catch (error) {
            console.error(
                "Error fetching tracking info from Ukrposhta mock API:",
                error
            );
            return {
                success: false,
                error: "Failed to fetch tracking info from Ukrposhta",
            };
        }
    }
}
