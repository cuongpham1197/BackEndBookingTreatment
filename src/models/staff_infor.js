'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Staff_Infor extends Model {
        static associate(models) {
            Staff_Infor.belongsTo(models.User, { foreignKey: 'staffId' });

            Staff_Infor.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData' }) //quan hệ 1-nhiều
            Staff_Infor.belongsTo(models.Allcode, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceTypeData' })
            Staff_Infor.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentTypeData' })

        }
    };
    Staff_Infor.init({
        staffId: DataTypes.INTEGER,
        treatmentId: DataTypes.INTEGER,
        shopId: DataTypes.INTEGER,
        priceId: DataTypes.STRING,
        provinceId: DataTypes.STRING,
        paymentId: DataTypes.STRING,
        addressShop: DataTypes.STRING,
        nameShop: DataTypes.STRING,
        note: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Staff_Infor',
        freezeTableName: true
    });
    return Staff_Infor;
};