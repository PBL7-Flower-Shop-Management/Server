import nodemailer from "nodemailer";

export const sendMail = async (emailObject: any) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SHOP_EMAIL,
            pass: process.env.SHOP_EMAIL_PASSWORD,
        },
    });

    emailObject.from = process.env.SHOP_EMAIL;

    await transporter.sendMail(emailObject);
};
