import nodemailer from "nodemailer";

export default class EmailApi {
  constructor(email, subject, text) {
    this.email = email;
    this.subject = subject;
    this.text = text;
  }
  transport() {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  option() {
    return {
      from: process.env.EMAIL,
      to: this.email,
      subject: this.subject,
      text: this.text,
    };
  }
  async send() {
    return await this.transport().sendMail(this.option());
  }
}
