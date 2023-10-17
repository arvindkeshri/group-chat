const Sequelize = require('sequelize'); //table
const sequelize = require('../util/sequelize'); //connected object

const GroupUser =sequelize.define('usergroups', {
    userId:{ type:Sequelize.INTEGER },
    groupId:{ type:Sequelize.INTEGER }
    },
)

module.exports = GroupUser;
