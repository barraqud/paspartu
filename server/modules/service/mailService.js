const nodemailer = require("nodemailer")

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }

  async sendActivationMail(mail, activationlink) {
    const status = await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: mail,
      subject: `Активируйте свою учетную запись` + process.env.HOME_PAGE,
      text: "",
      html: `                    
                    <div>
                        <h1>Для активации пройдите по ссылке</h1>
                        <a href="${activationlink}">${activationlink}</a>
                    </div>
                `,
    })
    return status
  }
  async sendResetPasswordLink(mail, activationlink) {
    const status = await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: mail,
      subject: `Восстановление доступа к ` + process.env.HOME_PAGE,
      text: "",
      html: `                    
                    <div style="margin:20px">
                        <h1>Вы забыли свой пароль?</h1>
                        <p>

                        В целях безопасности мы сбросили пароль от вашего аккаунта. Создать новый пароль вы можете по ссылке: 

                        <a href="${process.env.CLIENT_URL}:${process.env.CLIENT_PORT}/restore/${activationlink}">сменить пароль</a>
                        </p>
                        <p></p>
                    </div>
                `,
    })
    return status
  }
  async sendQuestion(sender, message) {
    const status = await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: `Связаться с нами / ${sender}`,
      text: "",
      html: `
            <div>
            <h5>Сообщение</h5>
            <p>${message}</p>
            <a href="mailto:${sender}">Ответить</a>
            </div>
            `,
    })
    return status
  }
}

module.exports = new MailService()
