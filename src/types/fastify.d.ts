import "fastify";
import { DomainContext } from "../../app/context";

declare module "fastify" {
    interface FastifyRequest {
        user?: {
            userId: string;
            email: string;
        };
    }

    interface FastifyInstance {
        domainContext: DomainContext;
    }

    interface FastifyInstance {
        requestContext: {
            get(key: "sessionData"): any;
            set(key: "sessionData", value: any): void;
            get(key: "hasSession"): boolean;
            set(key: "hasSession", value: boolean): void;
        };
    }
}
