const Sequelize = require('sequelize'); //table
const sequelize = require('../util/sequelize'); //connected object

const Group =sequelize.define('groups', {
    groupname: {type: Sequelize.STRING},
    }, 
    
)

module.exports = Group;
