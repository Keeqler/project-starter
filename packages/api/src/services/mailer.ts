import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const sendMail = (options: Mail.Options) =>
  mailer.sendMail({
    sender: process.env.SMTP_SENDER,
    ...options,
  })
