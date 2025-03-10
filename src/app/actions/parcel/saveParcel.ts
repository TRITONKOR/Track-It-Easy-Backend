import { HttpException } from "src/api/errors/httpException";
import { Parcel } from "src/domain/entities/parcel.entity";
import { ParcelService } from "src/domain/services/parcel.service";

export class SaveParcelAction {
    private parcelService: ParcelService;

    constructor({ parcelService }: { parcelService: ParcelService }) {
        this.parcelService = parcelService;
    }

    async execute(parcelData: Parcel, userId: string): Promise<Parcel> {
        if (!parcelData) {
            throw new HttpException(401, "Missing field");
        }

        try {
            const parcel = this.parcelService.create(parcelData);
            this.parcelService.saveParcelForUser(
                userId,
                (await parcel).getId()
            );
            return parcel;
        } catch (error) {
            console.error(error);
            throw new HttpException(401, "Track package failed");
        }
    }
}
