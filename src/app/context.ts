import { AuthService } from "src/domain/services/auth.service";
import { JwtService } from "src/domain/services/jwt.service";
import { TrackingService } from "src/domain/services/tracking.service";

import { NovaPoshtaAdapter } from "src/domain/adapters/novaposhta.adapter";
import { UkrPoshtaAdapter } from "src/domain/adapters/ukrposhta.adapter";

import { UserRepository } from "src/infra/db/repositories/user.repo";

const jwtService = new JwtService();

const repositories = {
    userRepository: new UserRepository(),
};

const services = {
    jwtService,
    trackingService: new TrackingService(
        new NovaPoshtaAdapter(),
        new UkrPoshtaAdapter()
    ),
    authService: new AuthService(repositories.userRepository, jwtService),
};

const domainContextData = {
    ...repositories,
    ...services,
};

export const domainContext = Object.freeze(
    Object.assign(Object.create(null), domainContextData)
);
