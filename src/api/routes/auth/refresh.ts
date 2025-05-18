import { FastifyReply, FastifyRequest, RequestGenericInterface } from "fastify";
import { RefreshAction } from "../../../app/actions/auth/refresh";
import { HttpException } from "../../errors/httpException";

interface RefreshAuthRequest extends RequestGenericInterface {
    Body: {};
}

export const refresh = {
    url: "/auth/refresh",
    method: "PATCH" as const,
    handler: async (
        request: FastifyRequest<RefreshAuthRequest>,
        reply: FastifyReply
    ) => {
        const _refreshToken = request.cookies["x-session"];

        if (!_refreshToken) {
            throw new HttpException(401, "No Refresh token provided");
        }

        try {
            const { accessToken, refreshToken, user } = await new RefreshAction(
                request.server.domainContext
            ).execute(_refreshToken);

            return reply
                .setCookie("x-session", refreshToken, {
                    maxAge: 3600 * 24 * 7,
                    secure: true,
                    httpOnly: true,
                    path: "/",
                })
                .code(200)
                .send({ accessToken, user });
        } catch (error) {
            console.error("Error during token refresh:", error);
            return reply
                .code(500)
                .send({ message: "An error occurred during token refresh" });
        }
    },
};
