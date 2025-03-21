import { AuthService } from "src/domain/services/auth.service";
import { JwtService } from "src/domain/services/jwt.service";
import { TrackingService } from "src/domain/services/tracking.service";

import { MeestExpressAdapter } from "src/domain/adapters/meestExpress.adapter";
import { NovaPoshtaAdapter } from "src/domain/adapters/novaposhta.adapter";

import { CourierRepository } from "@db/repositories/courier.repo";
import { ParcelRepository } from "@db/repositories/parcel.repo";
import { StatusRepository } from "@db/repositories/status.repo";
import { CourierService } from "src/domain/services/courier.service";
import { ParcelService } from "src/domain/services/parcel.service";
import { StatusService } from "src/domain/services/status.service";
import { UserRepository } from "src/infra/db/repositories/user.repo";

const userRepository = new UserRepository();
const parcelRepository = new ParcelRepository();
const courierRepository = new CourierRepository();
const statusRepository = new StatusRepository();

const jwtService = new JwtService();
const parcelService = new ParcelService(parcelRepository);
const courierService = new CourierService(courierRepository);
const statusService = new StatusService(statusRepository);

const novaposhtaAdapter = new NovaPoshtaAdapter();
const meestExpressAdapter = new MeestExpressAdapter();

const repositories = {
    userRepository,
    parcelRepository,
};

const services = {
    jwtService,
    courierService,
    trackingService: new TrackingService(
        parcelRepository,
        courierService,
        statusService,
        novaposhtaAdapter,
        meestExpressAdapter
    ),
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
