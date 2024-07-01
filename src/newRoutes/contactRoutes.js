const {Router} = require('express');
// const {getAllContactHandler} = require('../handlers/contact/getAllContactHandler');
const {getContactByIdHandler} = require('../handlers/Contacts/getContactByIdHandler');
// const {createContactHandler} = require('../handlers/contact/createContactHandler');
// const {updateContactHandler} = require('../handlers/contact/updateContactHandler');

const contactRoute = Router();

// contactRoute.get('/', getAllContactHandler);
contactRoute.get('/:id', getContactByIdHandler);
// contactRoute.post('/create/', createContactHandler);
// contactRoute.put('/update/:id', updateContactHandler);

module.exports = {contactRoute};