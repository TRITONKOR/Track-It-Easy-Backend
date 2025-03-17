import { NovaPoshtaAdapter } from "../adapters/novaposhta.adapter";
import { UkrPoshtaAdapter } from "../adapters/ukrposhta.adapter";

export class TrackingService {
    private novaPoshtaAdapter;
    private ukrPoshtaAdapter;

    constructor(
        novaPoshtaAdapter: NovaPoshtaAdapter,
        ukrPoshtaAdapter: UkrPoshtaAdapter
    ) {
        this.novaPoshtaAdapter = novaPoshtaAdapter;
        this.ukrPoshtaAdapter = ukrPoshtaAdapter;
    }

    async trackParcel(courier: "nova" | "ukr", trackingNumber: string) {
        if (courier === "nova") {
            return this.novaPoshtaAdapter.trackParcel(trackingNumber);
        } else if (courier === "ukr") {
            return this.ukrPoshtaAdapter.getTrackingInfo(trackingNumber);
        } else {
            throw new Error("Unsupported courier");
        }
    }
}
