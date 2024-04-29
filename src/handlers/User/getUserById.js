// const { Op } = require('sequelize')
const { User } = require('../../db');

const userById = async (id) => {

  const user = await User.findByPk(id);
  return user;
};

module.exports = userById;
