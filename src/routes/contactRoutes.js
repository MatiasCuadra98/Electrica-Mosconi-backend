const { Router } = require("express");
const {
  getContactByIdHandler,
} = require("../handlers/Contacts/getContactByIdHandler");

const contactRoute = Router();

contactRoute.get("/:id", getContactByIdHandler);

module.exports = contactRoute;
