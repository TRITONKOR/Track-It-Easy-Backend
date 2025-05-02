import { AuthService } from "src/domain/services/auth.service";
import { JwtService } from "src/domain/services/jwt.service";
import { TrackingService } from "src/domain/services/tracking.service";

import { MeestExpressAdapter } from "src/domain/adapters/meestExpress.adapter";
import { NovaPoshtaAdapter } from "src/domain/adapters/novaposhta.adapter";

import { CourierRepository } from "@db/repositories/courier.repo";
import { ParcelRepository } from "@db/repositories/parcel.repo";
import { StatusRepository } from "@db/repositories/status.repo";
import { TrackingEventRepository } from "@db/repositories/trackingEvent.repo";
import { CourierService } from "src/domain/services/courier.service";
import { ParcelService } from "src/domain/services/parcel.service";
import { StatusService } from "src/domain/services/status.service";
import { TrackingEventService } from "src/domain/services/trackingEvent.service";
import { UserService } from "src/domain/services/user.service";
import { UserRepository } from "src/infra/db/repositories/user.repo";

const userRepository = new UserRepository();
const parcelRepository = new ParcelRepository();
const courierRepository = new CourierRepository();
const statusRepository = new StatusRepository();
const trackingEventRepository = new TrackingEventRepository();

const jwtService = new JwtService();
const userService = new UserService(userRepository);
const parcelService = new ParcelService(parcelRepository);
const courierService = new CourierService(courierRepository);
const statusService = new StatusService(statusRepository);
const trackingEventService = new TrackingEventService(trackingEventRepository);

const novaposhtaAdapter = new NovaPoshtaAdapter();
const meestExpressAdapter = new MeestExpressAdapter();

const repositories = {
    userRepository,
    parcelRepository,
};

const services = {
    jwtService,
    courierService,
    userService,
    trackingService: new TrackingService(
        parcelRepository,
        courierService,
        statusService,
        trackingEventService,
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
