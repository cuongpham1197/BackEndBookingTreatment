'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Staff_Infor', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            staffId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            treatmentId: {
                type: Sequelize.INTEGER
            },
            shopId: {
                type: Sequelize.INTEGER
            },
            priceId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            provinceId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            paymentId: {
                type: Sequelize.STRING,
                allowNull: false
            },
            addressShop: {
                type: Sequelize.STRING,
                allowNull: false
            },
            nameShop: {
                type: Sequelize.STRING,
                allowNull: false
            },
            note: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Staff_Infor');
    }
};