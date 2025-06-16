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
    NODEMAILER: {
        host: process.env.NODEMAILER_HOST || "sandbox.smtp.mailtrap.io",
        port: Number(process.env.NODEMAILER_PORT) || 587,
        auth: {
            user: process.env.NODEMAILER_USER || "a57eefe7156ea6",
            pass: process.env.NODEMAILER_PASS || "6e599a1a8664e5",
        },
        from:
            process.env.NODEMAILER_FROM ||
            "Track It Easy <trackiteasymain@gmail.com>",
    },
    MOCK_URL: process.env.MOCK_URL || "http://mock-api:3001",
};
