const { Router } = require("express");
const deletedBusiness = require("../../controllers/Business/businessDelete");
const deleteBusinessRoute = Router();


deleteBusinessRoute.delete("/deleteBusiness/:id", deletedBusiness);


module.exports = deleteBusinessRoute;