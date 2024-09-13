const {getAllContacts} = require("./getAllContacts")
const {Contacts} = require("../../db");
const {Op, Sequelize} = require('sequelize');

const searchContact = async(search) => {

    console.log('search por query:', search);
    console.log('search tipo de dato', typeof(search));

    const contactsFiltered = await  Contacts.findAll({
        where: {
            // [Op.or]: [
            //     { name: { [Op.iLike]: `%${search}%` } },
            //     { userName: { [Op.iLike]: `%${search}%` } },
            //     //{ phone: { [Op.iLike]: `%${search}%` } }, // Se trata como número, convertirlo a string
            //     { Email: { [Op.iLike]: `%${search}%` } },
            //     { phone: Sequelize.cast(Sequelize.col('phone'), 'TEXT'), [Op.iLike]: `%${search}%`} // Convierte BIGINT a TEXT para permitir iLike
            // ]
            [Op.or]: [
                {
                  name: { [Op.iLike]: `%${search}%`},
                  userName: {[Op.iLike]: `%${search}%`},
                  //phone: {[Op.iLike]: `%${search}%`},
                  Email: {[Op.iLike]: `%${search}%`},
                  //phone: {Sequelize.cast(Sequelize.col('phone'), 'TEXT'), [Op.iLike]: `%${search}%`} 
                },
            ],
        }
    })
    if(!contactsFiltered.length) throw new Error('There are not contacts that match the search')
        return contactsFiltered
}

module.exports = {searchContact}


