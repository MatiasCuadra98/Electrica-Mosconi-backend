const {getAllContacts} = require("../../controllers/Contacts/getAllContacts")
const {searchContact} = require("../../controllers/Contacts/searchContact")
const getAllContactsHandler = async(req, res) => {
    const {name, phone, userName, Email} = req.query;
    console.log('llega al handler esta data => name: ', name, 'phone: ', phone, 'userName: ', userName, 'Email: ', Email);
    
     try {
        const search = name || phone || userName || Email;
        console.log('search en try del handler: ', search);
        
    const allContacts = search ? await searchContact(search): await getAllContacts()
    !allContacts.length ? res.status(400).send('Contacts not found') : res.status(200).json(allContacts)
 } catch (error) {
    res.status(500).json({error: error.message})
 }
}

module.exports = {getAllContactsHandler}

