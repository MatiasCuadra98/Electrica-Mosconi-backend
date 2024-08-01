const { Router } = require("express");
const {
  getBusinessByIdHandler,
} = require("../handlers/Business/getBusinessByIdHandler");
const {
  updateBusinessHandler,
} = require("../handlers/Business/updateBusinessHandler");
const {
  createBusinessHandler,
} = require("../handlers/Business/createBusinessHandler");

const businessRoute = Router();

businessRoute.get("/:id", getBusinessByIdHandler);
businessRoute.post("/create", createBusinessHandler);
businessRoute.put("/update/:id", updateBusinessHandler);

module.exports = businessRoute;
