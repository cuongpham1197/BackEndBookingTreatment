import db from "../models/index";
// import bcrypt from 'bcryptjs';
require('dotenv').config();
import emailService from './emailService';
import _ from "lodash"
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopStaffHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: true,
                nest: true
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getAllStaff = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let staffs = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: staffs
            })
        } catch (e) {
            reject(e)
        }
    })
}

let saveDetailInforStaff = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `missing parameter: ${checkObj.element}`
                })


            } else {
                //insert to Markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        staffId: inputData.staffId
                    })
                } else if (inputData.action === 'EDIT') {
                    let staffMarkdown = await db.Markdown.findOne({
                        where: { staffId: inputData.staffId },
                        raw: false
                    })

                    if (staffMarkdown) {
                        staffMarkdown.contentHTML = inputData.contentHTML;
                        staffMarkdown.contentMarkdown = inputData.contentMarkdown;
                        staffMarkdown.description = inputData.description;
                        staffMarkdown.updateAt = new Date();
                        await staffMarkdown.save()
                    }
                }

                let staffInfor = await db.Staff_Infor.findOne({
                    where: {
                        staffId: inputData.staffId,
                    },
                    raw: false
                })

                if (staffInfor) {//update
                    staffInfor.staffId = inputData.staffId;
                    staffInfor.priceId = inputData.selectedPrice;
                    staffInfor.provinceId = inputData.selectedProvince;
                    staffInfor.paymentId = inputData.selectedPayment;
                    staffInfor.nameShop = inputData.nameShop;
                    staffInfor.addressShop = inputData.addressShop;
                    staffInfor.note = inputData.note;

                    staffInfor.treatmentId = inputData.treatmentId;
                    staffInfor.shopId = inputData.shopId;
                    await staffInfor.save()
                } else {
                    await db.Staff_Infor.create({
                        staffId: inputData.staffId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectProvince,
                        paymentId: inputData.selectedPayment,
                        nameShop: inputData.nameShop,
                        addressShop: inputData.addressShop,
                        note: inputData.note,
                        treatmentId: inputData.treatmentId,
                        shopId: inputData.shopId,
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save information succeed'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}


let getDetailStaffById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Staff_Infor,
                            attributes: {
                                exclude: ['id', 'staffId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {//convert ảnh trc khi trả về client
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.staffId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let existing = await db.Schedule.findAll(
                    {
                        where: { staffId: data.staffId, date: data.formattedDate },
                        attributes: ['timeType', 'date', 'staffId', 'maxNumber'],
                        raw: true
                    }
                );


                //compare difference
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;//so sánh giữa string và số nguyên
                });

                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (staffId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!staffId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'missing parameter'
                })
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        staffId: staffId,
                        date: date
                    },

                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'staffData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!dataSchedule) dataSchedule = [];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInforStaffById = (IdInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!IdInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Staff_Infor.findOne({
                    where: {
                        staffId: IdInput
                    },
                    attributes: {
                        exclude: ['id', 'staffId']
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getProfileStaffById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown']
                        },

                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Staff_Infor,
                            attributes: {
                                exclude: ['id', 'staffId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] }
                            ]
                        },
                    ],

                    raw: false,
                    nest: true
                })

                if (data && data.image) {//convert ảnh trc khi trả về client
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['staffId', 'contentHTML', 'contentMarkdown', 'action',
        'selectedPrice', 'selectedPayment', 'selectedProvince', 'nameShop',
        'addressShop', 'note', 'treatmentId'
    ]

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i]
            break;
        }
    }

    return {
        isValid: isValid,
        element: element
    }
}

let getListCustomerForStaff = (staffId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!staffId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: 'S2',
                        staffId: staffId,
                        date: date
                    },
                    include: [
                        {
                            model: db.User, as: 'customerData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                {
                                    model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']
                                }
                            ]
                        },
                        {
                            model: db.Allcode, as: 'timeTypeDataCustomer', attributes: ['valueEn', 'valueVi']
                        }
                    ],
                    raw: false,
                    nest: true
                })

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let sendTreatmentDetail = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.staffId || !data.customerId || !data.timeType
                || !data.imgBase64) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'

                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        staffId: data.staffId,
                        customerId: data.customerId,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }

                await emailService.sendAttachment(data);

                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    getTopStaffHome: getTopStaffHome,
    getAllStaff: getAllStaff,
    saveDetailInforStaff: saveDetailInforStaff,
    getDetailStaffById: getDetailStaffById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforStaffById: getExtraInforStaffById,
    getProfileStaffById: getProfileStaffById,
    checkRequiredFields: checkRequiredFields,
    getListCustomerForStaff: getListCustomerForStaff,
    sendTreatmentDetail: sendTreatmentDetail
}