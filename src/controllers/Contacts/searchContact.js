const {getAllContacts} = require("./getAllContacts")
const {Contacts} = require("../../db");
const {Op} = require('sequelize');

const searchContact = async(search) => {

    console.log('search por query:', search);
    console.log('search tipo de dato', typeof(search));
    

    // const utilSearch = typeof(search) === 'string' ? search.toLowerCase() : search;
    // console.log('search condicional: ', utilSearch);
    
    const contactsFiltered = await  Contacts.findAll({
        where: {
            [Op.or]: [
                {
                  name: { [Op.iLike]: `%${search}%`},
                  userName: {[Op.iLike]: `%${search}%`},
                  phone: {[Op.iLike]: `%${search}%`},
                  Email: {[Op.iLike]: `%${search}%`}
                },
            ],
        }
    })
    if(!contactsFiltered.length) throw new Error('There are not contacts that match the search')
        return contactsFiltered
}

module.exports = {searchContact}


