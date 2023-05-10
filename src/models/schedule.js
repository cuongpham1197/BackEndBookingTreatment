'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        static associate(models) {
            // define association here
            Schedule.belongsTo(models.Allcode,
                {
                    foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData'
                })

            Schedule.belongsTo(models.User,
                { foreignKey: 'staffId', targetKey: 'id', as: 'staffData' })
        }
    };
    Schedule.init({
        maxNumber: DataTypes.INTEGER,
        date: DataTypes.STRING,
        timeType: DataTypes.STRING,
        staffId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Schedule',
    });
    return Schedule;
};