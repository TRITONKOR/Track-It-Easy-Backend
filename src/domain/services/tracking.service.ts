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

    async trackPackage(courier: "nova" | "ukr", trackingNumber: string) {
        console.log("service " + courier);
        if (courier === "nova") {
            return this.novaPoshtaAdapter.getTrackingInfo(trackingNumber);
        } else if (courier === "ukr") {
            return this.ukrPoshtaAdapter.getTrackingInfo(trackingNumber);
        } else {
            throw new Error("Unsupported courier");
        }
    }
}
