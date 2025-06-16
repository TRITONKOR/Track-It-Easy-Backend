import nodemailer from "nodemailer";
import { config } from "../config/config";

export const mailer = nodemailer.createTransport({
    host: config.NODEMAILER.host,
    port: config.NODEMAILER.port,
    auth: {
        user: config.NODEMAILER.auth.user,
        pass: config.NODEMAILER.auth.pass,
    },
});

export async function sendStatusUpdateEmail(
    to: string,
    trackingNumber: string,
    status: string,
    statusLocation: string
) {
    const info = await mailer.sendMail({
        from: config.NODEMAILER.from,
        to,
        subject: `Оновлення статусу посилки ${trackingNumber}`,
        text: `Ваша посилка ${trackingNumber} отримала новий статус: ${status} (${statusLocation})`,
        html: `<p>Ваша посилка <b>${trackingNumber}</b> отримала новий статус: <b>${status}</b> (${statusLocation})</p>`,
    });
    return info;
}
