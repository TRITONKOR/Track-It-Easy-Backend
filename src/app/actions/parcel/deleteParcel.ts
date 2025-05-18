import { HttpException } from "@/api/errors/httpException";
import { ParcelService } from "@/domain/services/parcel.service";

export class DeleteParcelAction {
    private parcelService: ParcelService;

    constructor({ parcelService }: { parcelService: ParcelService }) {
        this.parcelService = parcelService;
    }

    async execute(parcelId: string, accessToken: string): Promise<void> {
        try {
            await this.parcelService.delete(parcelId);

            return;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }
        }
    }
}
