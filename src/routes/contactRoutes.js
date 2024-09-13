const { Router } = require("express");
const {getAllContactsHandler} = require("../handlers/Contacts/getAllContactsHandler")
const {getContactByIdHandler} = require("../handlers/Contacts/getContactByIdHandler");

const contactRoute = Router();

contactRoute.get("/", getAllContactsHandler)
contactRoute.get("/:id", getContactByIdHandler);

module.exports = contactRoute;
