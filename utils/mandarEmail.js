import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export async function mandarEmail(email, subject, html) {
    // Configure o transporte com os dados do seu serviço de e-mail
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    // Defina os detalhes do e-mail
    let mailOptions = {
        from: '"Endoday" <no-reply@gmail.com.br>',
        to: `${email}`,
        subject: `Endoday: ${subject}.`, // Assunto
        text: '', // conteúdo em texto puro
        html: `${html}` // se desejar enviar em HTML
    };

    // Envie o e-mail
    let info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado: ' + info.response);
}
