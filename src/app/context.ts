import { AuthService } from "@/domain/services/auth.service";
import { JwtService } from "@/domain/services/jwt.service";
import { TrackingService } from "@/domain/services/tracking.service";

import { MeestExpressAdapter } from "@/domain/adapters/meestExpress.adapter";
import { NovaPoshtaAdapter } from "@/domain/adapters/novaposhta.adapter";

import { UkrposhtaAdapter } from "@/domain/adapters/ukrposhta.adapter";
import { CourierService } from "@/domain/services/courier.service";
import { ParcelService } from "@/domain/services/parcel.service";
import { StatusService } from "@/domain/services/status.service";
import { TrackingEventService } from "@/domain/services/trackingEvent.service";
import { UserService } from "@/domain/services/user.service";
import { UserRepository } from "@/infra/db/repositories/user.repo";
import { CourierRepository } from "@db/repositories/courier.repo";
import { ParcelRepository } from "@db/repositories/parcel.repo";
import { StatusRepository } from "@db/repositories/status.repo";
import { TrackingEventRepository } from "@db/repositories/trackingEvent.repo";

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
const ukrposhtaAdapter = new UkrposhtaAdapter();
const meestExpressAdapter = new MeestExpressAdapter();

const repositories = {
    userRepository,
    parcelRepository,
};

const services = {
    jwtService,
    courierService,
    userService,
    trackingEventService,
    trackingService: new TrackingService(
        parcelRepository,
        courierService,
        statusService,
        trackingEventService,
        novaposhtaAdapter,
        meestExpressAdapter,
        ukrposhtaAdapter
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
