const Sequelize = require('sequelize');

const sequelize = require('../database');

const Employee = sequelize.define('employee', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,
    cafeId: { type: Sequelize.STRING, allowNull: false }

}, { freezeTableName: true });

module.exports = Employee;  