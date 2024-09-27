const { Router } = require("express");
const {getAllUsersHandler} = require("../handlers/User/getAllUserHandler");
const {getUserByIdHandler} = require("../handlers/User/getUserByIdHandler");
const {createUserHandler} = require("../handlers/User/createUserHandler");
const {updateUserHandler} = require("../handlers/User/updateUserHandler");
const {deleteUserHandler} = require("../handlers/User/deleteUserHandler");
const {loginAdmiHandler} = require('../handlers/User/loginAdmiHandler')
const {logoutAdmiHandler} = require('../handlers/User/logoutAdmiHandler');


const userRoute = Router();

userRoute.get("/", getAllUsersHandler);
userRoute.get("/:id", getUserByIdHandler);
userRoute.post("/create", createUserHandler);
userRoute.put("/update/:id", updateUserHandler);
userRoute.put('login/admi/:id', loginAdmiHandler);
userRoute.put('logout/admi/:id', logoutAdmiHandler);
userRoute.delete("/delete/:id", deleteUserHandler);

module.exports = userRoute;
