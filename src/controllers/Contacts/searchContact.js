const {getAllContacts} = require("./getAllContacts")
const {Contacts} = require("../../db");
const {Op} = require('sequelize');

const searchContact = async(search) => {
//  const allContacts = await getAllContacts();
//  if(search){
//      const utilSearch = typeof(search) === 'string' ? search.toLowerCase() : search;
//     const contactsFiltered = allContacts.filter((contact) => {
//         contact.name.toLowerCase().include(utilSearch) || contact.phone.include(utilSearch) || contact.userName.toLowerCase().include(utilSearch) || contact.Email.toLowerCase().include(utilSearch)
//     }) 
//     return contactsFiltered;
//  }
    console.log('search por query:', search);

    const utilSearch = typeof(search) === 'string' ? search.toLowerCase() : search;
    console.log('search condicional: ', utilsearch);
    
    const contactsFiltered = await  Contacts.findAll({
        where: {
            name: {
                [Op.iLike]: `%${utilSearch}%`
            }
        }
    })
    if(!contactsFiltered.length) throw new Error('There are not contacts that match the search')
        return contactsFiltered
}

module.exports = {searchContact}


