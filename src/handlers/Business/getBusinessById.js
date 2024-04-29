// const { Op } = require('sequelize');
const { Business } = require('../../db');

const businessById = async (id) => {

  const businessById = await Business.findByPk(id);
  return businessById;
};

module.exports = businessById;
