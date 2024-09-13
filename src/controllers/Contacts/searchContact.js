const {getAllContacts} = require("./getAllContacts")

const searchContact = async(search) => {
 const allContacts = await getAllContacts();
 if(search){
    const utilSearch = typeof(search) === 'string' ? search.toLowerCase() : search;
    const contactsFiltered = allContacts.filter((contact) => {
        contact.name.toLowerCase().include(utilSearch) || contact.phone.include(utilSearch) || contact.userName.toLowerCase().include(utilSearch) || contact.Email.toLowerCase().include(utilSearch)
    }) 
    return contactsFiltered;
 }
}

module.exports = {searchContact}
