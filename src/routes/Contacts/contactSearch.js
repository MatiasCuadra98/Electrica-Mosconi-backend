const {Router} = require('express')
const ContactsSearchHandler = require('../../handlers/Contacts/contactsSearch')

const ContactsSearch = Router()

ContactsSearch.get('/contactsSearch', ContactsSearchHandler)

module.exports = ContactsSearch