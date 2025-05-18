import * as dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: Number(process.env.PORT) || 3000,
    HOST: process.env.HOST || 3000,
    DATABASE_URL: process.env.DATABASE_URL,
    ACCESS_SECRET: process.env.ACCESS_SECRET || "access",
    REFRESH_SECRET: process.env.REFRESH_SECRET || "refresh",
    IS_DEV_ENV: process.env.NODE_ENV === "development",
    COOKIE_SECRET: process.env.COOKIE_SECRET || "cookie",
    NOVA_POSHTA_API_KEY: process.env.NOVA_POSHTA_API_KEY || "",
    NOVA_POSHTA_API_URL:
        process.env.NOVA_POSHTA_API_URL ||
        "https://api.novaposhta.ua/v2.0/json/",
};
