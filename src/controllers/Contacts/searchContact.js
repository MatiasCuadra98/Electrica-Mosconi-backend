const {getAllContacts} = require("./getAllContacts")
const {Contacts} = require("../../db");
const {Op, Sequelize} = require('sequelize');

const searchContact = async(search) => {

    console.log('search por query:', search);
   // console.log('search tipo de dato', typeof(search));

    const contactsFiltered = await  Contacts.findAll({
        where: {
            name: { [Op.iLike]: `%${search}%`},    
        }
    })
    if(!contactsFiltered.length) throw new Error('There are not contacts that match the search')
        return contactsFiltered
}

module.exports = {searchContact}


