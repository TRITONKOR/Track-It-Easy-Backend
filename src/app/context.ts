import { AuthService } from "src/domain/services/auth.service";
import { JwtService } from "src/domain/services/jwt.service";
import { TrackingService } from "src/domain/services/tracking.service";

import { NovaPoshtaAdapter } from "src/domain/adapters/novaposhta.adapter";
import { UkrPoshtaAdapter } from "src/domain/adapters/ukrposhta.adapter";

import { ParcelRepository } from "@db/repositories/parcel.repo";
import { ParcelService } from "src/domain/services/parcel.service";
import { UserRepository } from "src/infra/db/repositories/user.repo";

const userRepository = new UserRepository();
const parcelRepository = new ParcelRepository();

const jwtService = new JwtService();
const parcelService = new ParcelService(parcelRepository);

const novaposhtaAdapter = new NovaPoshtaAdapter();
const ukrposhtaAdapter = new UkrPoshtaAdapter();

const repositories = {
    userRepository,
    parcelRepository,
};

const services = {
    jwtService,
    trackingService: new TrackingService(novaposhtaAdapter, ukrposhtaAdapter),
    authService: new AuthService(userRepository, jwtService),
    parcelService,
};

const domainContextData = {
    ...repositories,
    ...services,
};

export const domainContext = Object.freeze(
    Object.assign(Object.create(null), domainContextData)
);
