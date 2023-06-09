import db from "../models/index";
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (staffId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&staffId=${staffId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.staffId || !data.timeType || !data.date || !data.fullName
                || !data.selectedGender || !data.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    receiverEmail: data.email,
                    customerName: data.fullName,
                    time: data.timeString,
                    staffName: data.staffName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.staffId, token)
                })

                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName
                    },
                });

                console.log('check user customerService: ', user[0])

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { customerId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            staffId: data.staffId,
                            customerId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: 'save information succeeded'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}


let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.staffId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing Parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        staffId: data.staffId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update Appointment succeeded'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has activated or does not exist '
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}