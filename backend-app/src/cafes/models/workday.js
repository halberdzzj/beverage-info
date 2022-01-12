const Sequelize = require('sequelize');

const sequelize = require('../database');

const WorkRecord = sequelize.define('workrecord', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    employeeId: Sequelize.STRING,
    date: Sequelize.DATE,

}, { freezeTableName: true });

module.exports = WorkRecord;