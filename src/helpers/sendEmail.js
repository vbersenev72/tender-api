import nodemailer from 'nodemailer'
import { config } from 'dotenv';

config()

export async function sendEmail(subject, text, email) {
    try {
        const transporter = nodemailer.createTransport(
            {
                host: 'smtp.yandex.ru',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: process.env.NODEMAILER_PASSWORD
                },
            },
            {
                from: `Tender Company <${process.env.NODEMAILER_EMAIL}>`
            }
        );

        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL,
            to: email,
            subject: subject,
            text: text
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Ошибка при отправке письма:', error);
            } else {
                console.log('Письмо успешно отправлено:', info.response);
            }
        });

    } catch (error) {
        console.log(error);
    }

}
sendEmail('Пароль для использования Tender', "Ваш пароль для использования платформы Tender: 12345jhgdju3 ", "vbersenev72@gmail.com")