// const { Op } = require('sequelize')
const { User } = require('../../db');

const allUsers = async () => {
  
  const users = await User.findAll();
  return users;
};

module.exports = allUsers;
