// const { Op } = require('sequelize')
const { User } = require('../../db');

const allUsers = async () => {
//**--AGREGUE ORDEN POR NOMBRE Y DATOS DEL BUSINESS */  
  const users = await User.findAll(
    { order: [
      ['name'],
  ],
include: {
  model: Business,
  attributes: ['id', 'name']
}
}
  );
  return users;
};

module.exports = allUsers;
