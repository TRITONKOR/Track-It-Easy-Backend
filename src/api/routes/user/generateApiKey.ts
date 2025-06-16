import { GenerateApiKeyAction } from "@/app/actions/user/generateApiKey";
import {
    FastifyReply,
    FastifyRequest,
    RequestGenericInterface,
    RouteShorthandOptions,
} from "fastify";

interface GenerateApiKeyRequest extends RequestGenericInterface {
    Params: {
        id: string;
    };
}

const generateApiKeyOptions: RouteShorthandOptions = {
    schema: {
        tags: ["users", "admin"],
        summary: "Generate a new API key for a user",
        params: {
            type: "object",
            properties: {
                id: { type: "string", description: "User ID" },
            },
            required: ["id"],
        },
        response: {
            200: {
                type: "object",
                properties: {
                    apiKey: { type: "string" },
                },
            },
            401: {
                type: "object",
                properties: { message: { type: "string" } },
            },
        },
    },
};

export const generateApiKey = {
    url: "/users/:id/generate-api-key",
    method: "POST" as const,
    schema: generateApiKeyOptions.schema,
    handler: async (
        request: FastifyRequest<GenerateApiKeyRequest>,
        reply: FastifyReply
    ) => {
        const { id } = request.params;
        const apiKey = await new GenerateApiKeyAction(
            request.server.domainContext
        ).execute(id);
        return reply.code(200).send({ apiKey });
    },
};
