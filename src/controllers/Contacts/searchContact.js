const {getAllContacts} = require("./getAllContacts")
const {Contacts} = require("../../db");
const {Op, Sequelize} = require('sequelize');

const searchContact = async(search) => {

    console.log('search por query:', search);
   // console.log('search tipo de dato', typeof(search));

    const contactsFiltered = await  Contacts.findAll({
        where: {
            [Op.or]: [
                {
                  name: { [Op.iLike]: `%${search}%`},
                  userName: {[Op.iLike]: `%${search}%`, [Op.not]: null},
                  //phone: {[Op.iLike]: `%${search}%`, [Op.not]: null},
                  Email: {[Op.iLike]: `%${search}%`, [Op.not]: null},
                },
            ],
        }
    })
    if(!contactsFiltered.length) throw new Error('There are not contacts that match the search')
        return contactsFiltered
}

module.exports = {searchContact}


