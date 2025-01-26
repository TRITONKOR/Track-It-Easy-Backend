import * as dotenv from "dotenv";

dotenv.config();

export const config = {
    PORT: Number(process.env.PORT) || 3000,
    HOST: process.env.HOST || 3000,
    DB_URL: process.env.DB_URL,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    ACCESS_SECRET: process.env.ACCESS_SECRET || "access",
    REFRESH_SECRET: process.env.REFRESH_SECRET || "refresh",
    IS_DEV_ENV: process.env.NODE_ENV === "development",
    COOKIE_SECRET: process.env.COOKIE_SECRET || "cookie",
};
