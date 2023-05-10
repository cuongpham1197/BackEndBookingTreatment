'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Shop extends Model {
        static associate(models) {
        }
    };
    Shop.init({
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        descriptionMarkdown: DataTypes.TEXT,
        descriptionHTML: DataTypes.TEXT,
        image: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Shop',
    });
    return Shop;
};