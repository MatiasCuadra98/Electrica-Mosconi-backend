// const { Op } = require('sequelize');
const { Business } = require('../../db');

const allBusiness = async () => {

  const allBusiness = await Business.findAll();
  return allBusiness;
};

module.exports = allBusiness;
