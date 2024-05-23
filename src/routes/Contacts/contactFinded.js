const {Router} = require('express')
const findedContact = require('../../handlers/Contacts/contactsFinds')

const ContactFindedRouter = Router()

ContactFindedRouter.get('/msgFind',findedContact)

module.exports=ContactFindedRouter