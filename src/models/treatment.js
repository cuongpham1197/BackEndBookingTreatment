'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Treatment extends Model {
        static associate(models) {
        }
    };
    Treatment.init({
        name: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT,
        descriptionMarkdown: DataTypes.TEXT,
        image: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Treatment',
    });
    return Treatment;
};