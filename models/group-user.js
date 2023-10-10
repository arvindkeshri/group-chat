const Sequelize = require('sequelize'); //table
const sequelize = require('../util/sequelize'); //connected object

const GroupUser =sequelize.define('groupUsers', {
    isGroupAdmin: {type: Sequelize.BOOLEAN, defaultValue: true},

    },
)

module.exports = GroupUser;
