import shopService from '../services/shopService';

let createShop = async (req, res) => {
    try {
        let infor = await shopService.createShop(req.body);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getDetailShopById = async (req, res) => {
    try {
        let infor = await shopService.getDetailShopById(req.query.id);
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllShop = async (req, res) => {
    try {
        let infor = await shopService.getAllShop();
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

module.exports = {
    createShop: createShop,
    getDetailShopById: getDetailShopById,
    getAllShop: getAllShop
}