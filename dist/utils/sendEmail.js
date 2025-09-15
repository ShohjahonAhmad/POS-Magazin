import dotenv from 'dotenv';
import transporter from './transporter.js';
dotenv.config();
const USER = process.env.USER;
const BASE_URL = process.env.BASE_URL;
export const sendEmailToken = async (email, token) => {
    if (!USER || !BASE_URL) {
        throw new Error("base_url or user error");
    }
    try {
        const link = `${BASE_URL}/auth/tasdiq-email?token=${token}`;
        await transporter.sendMail({
            from: `POS-MAGAZIN <pos@magazin.uz>`,
            to: email,
            subject: "Iltimos elektron pochtangizni tasdiqlang",
            text: `Elektron pochtangizni tasdiqlash uchun link ustiga bosing: ${link}`,
            html: `<p>Elektron pochtangizni tasdiqlash uchun link ustiga bosing:</p><a href="${link}">${link}</a>`
        });
    }
    catch (err) {
        console.error("Failed to send email:", err);
        throw new Error("email error");
    }
};
