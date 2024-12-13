const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('tfg', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',  
  port:3306,
  logging: false,   
  timezone: '-03:00' 
});

module.exports = sequelize