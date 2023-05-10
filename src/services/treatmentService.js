const db = require("../models");

let createNewTreatment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name
                || !data.imageBase64
                || !data.descriptionHTML
                || !data.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                await db.Treatment.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })

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


let getAllTreatment = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Treatment.findAll({

            });
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item;
                })
            }

            resolve({
                errMessage: 'ok',
                errCode: 0,
                data
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getDetailTreatmentById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Treatment.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown']
                })

                if (data) {
                    let staffTreatment = [];
                    if (location === 'ALL') {
                        staffTreatment = await db.staff_infor.findAll({
                            where: { treatmentId: inputId },
                            attributes: ['staffId', 'provinceId'],
                        })
                    } else {
                        staffTreatment = await db.staff_infor.findAll({
                            where: {
                                treatmentId: inputId,
                                provinceId: location
                            },
                            attributes: ['staffId', 'provinceId'],
                        })
                    }

                    data.staffTreatment = staffTreatment;

                } else data = {};

                resolve({
                    errMessage: 'ok',
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteTreatment = (treatmentId) => {
    return new Promise(async (resolve, reject) => {
        let treatment = await db.Treatment.findOne({
            where: { id: treatmentId }
        })
        if (!treatment) {
            resolve({
                errCode: 2,
                errMessage: `treatment is not exist`
            })
        }

        await db.Treatment.destroy({
            where: { id: treatmentId }
        });

        resolve({
            errCode: 0,
            message: `deleted`
        })
    })
}

let updateTreatment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.treatmentName) {
                resolve({
                    errCode: 2,
                    errMessage: 'missing required parameters'
                })
            }
            let treatment = await db.Treatment.findOne({
                where: { id: data.id },
                raw: false
            })
            if (treatment) {
                treatment.name = data.treatmentName;
                treatment.descriptionHTML = data.descriptionHTML;
                treatment.descriptionMarkdown = data.descriptionMarkdown;
                if (data.avatar) {
                    treatment.image = data.avatar
                }

                await treatment.save();

                resolve({
                    errCode: 0,
                    message: 'update successfully'
                })
            }
            else {
                resolve({
                    errCode: 1,
                    message: 'treatment not found'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    createNewTreatment: createNewTreatment,
    getAllTreatment: getAllTreatment,
    getDetailTreatmentById: getDetailTreatmentById,
    deleteTreatment: deleteTreatment,
    updateTreatment: updateTreatment
}