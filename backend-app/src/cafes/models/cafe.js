const Sequelize = require('sequelize');

const sequelize = require('../database');

const Cafe = sequelize.define('cafe', {
    id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    description: Sequelize.STRING,
    name: Sequelize.STRING,
    logo: Sequelize.STRING,
    location: Sequelize.STRING,

},{freezeTableName: true});

module.exports = Cafe;