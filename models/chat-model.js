const Sequelize = require('sequelize'); //table
const sequelize = require('../util/sequelize'); //connected object

const Chat =sequelize.define('chats', {
    message: {type: Sequelize.STRING},
    }, 
    
)

module.exports = Chat;
