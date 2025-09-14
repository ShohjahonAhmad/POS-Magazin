import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: USER,
        pass: PASSWORD
    }
});
export default transporter;
