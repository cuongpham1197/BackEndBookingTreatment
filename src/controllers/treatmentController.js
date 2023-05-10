import treatmentService from '../services/treatmentService';

let createNewTreatment = async (req, res) => {
    try {
        let infor = await treatmentService.createNewTreatment(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllTreatment = async (req, res) => {
    try {
        let infor = await treatmentService.getAllTreatment();
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailTreatmentById = async (req, res) => {
    try {
        let infor = await treatmentService.getDetailTreatmentById(req.query.id, req.query.location);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleEditTreatment = async (req, res) => {
    let data = req.body;
    let message = await treatmentService.updateTreatment(data);
    return res.status(200).json(message)
}

module.exports = {
    createNewTreatment: createNewTreatment,
    getAllTreatment: getAllTreatment,
    getDetailTreatmentById: getDetailTreatmentById,
    handleEditTreatment: handleEditTreatment
}