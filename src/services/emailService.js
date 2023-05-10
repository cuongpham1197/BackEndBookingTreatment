require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"Dịch vụ đặt lịch ABC" <cuongpham1197@gmail.com>',
        to: dataSend.receiverEmail,
        subject: "Thông tin đặt lịch liệu trình",
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.customerName}!</h3>
        <p>Bạn nhận được email này vì bạn đã đặt lịch liệu trình từ dịch vụ đặt lịch liệu trình online ABC</p>
        <p>Thông tin đặt lệnh liệu trình:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Chủ Shop: ${dataSend.staffName}</b></div>

        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link dưới đây để xác nhận</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cám ơn</div>
        `
    }

    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.customerName}!</h3>
        <p>You received this email because you booked an online treatment appointment from ABC Service</p>
        <p>Appointment information: </p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Staff name: ${dataSend.staffName}</b></div>

        <p>If the above information is true, please click on the link below to confirm</p>
        <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Thank you!</div>
        `
    }
    return result;
}

let getBodyHTMLEmailTreatmentDetail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result =
            `
        <h3>Xin chào ${dataSend.customerName}!</h3>
        <p>Bạn nhận được email này vì bạn đã đặt lịch khám bệnh từ dịch vụ đặt lịch liệu trình online ABC</p>
        <p>Thông tin liệu trình được đặt trong file đính kèm</p>

        <div>Xin chân thành cám ơn</div>
        `
    }

    if (dataSend.language === 'en') {
        result =
            `
        <h3>Dear ${dataSend.customerName}!</h3>
        <p>You received this email because you booked an online treatment appointment from ABC Service</p>
        <p>Attachment file: </p>
        <div>Thank you!</div>
        `
    }
    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            let info = await transporter.sendMail({
                from: '"Dịch vụ đặt lịch ABC" <cuongpham1197@gmail.com>',
                to: dataSend.email,
                subject: "Kết quả đặt lịch liệu trình",
                html: getBodyHTMLEmailTreatmentDetail(dataSend),
                attachments: [
                    {
                        filename: `treatmentDetail-${dataSend.customerId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    },
                ],
            });

            resolve(true)
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment
}