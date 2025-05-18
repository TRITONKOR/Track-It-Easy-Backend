import { HttpException } from "@/api/errors/httpException";
import { ParcelRepository } from "@db/repositories/parcel.repo";

export class GetAllParcelsAction {
    private parcelRepository: ParcelRepository;

    constructor({ parcelRepository }: { parcelRepository: ParcelRepository }) {
        this.parcelRepository = parcelRepository;
    }

    async execute() {
        try {
            return await this.parcelRepository.findAll();
        } catch (error) {
            console.error(error);
            throw new HttpException(500, "Failed to fetch parcels");
        }
    }
}
