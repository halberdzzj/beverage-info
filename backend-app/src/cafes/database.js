const Sequelize = require('sequelize');

const sequelize = new Sequelize('cafe_db', 'root', 'password', { dialect: 'mysql', host: 'mysql' });


module.exports = sequelize;

