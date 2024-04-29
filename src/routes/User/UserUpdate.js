const { Router } = require("express");
const userUpdate = require("../../controllers/User/userUpdate");
const userUpdateRouter = Router();

userUpdateRouter.put("/updateUser/:id", userUpdate);

module.exports = userUpdateRouter;