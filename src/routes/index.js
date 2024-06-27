// const login = require('./Login/loginRoute')
// const validate = require('./userValidation/userValidation')
const createUser = require("./User/UserPost");
const userSearch = require("./User/UserSearch");
//const userUpdate = require("./User/userUpdate");
const userDelete = require("./User/UserDelete");
const userGetAll = require("./User/userGetAll");
const userGetById = require("./User/userGetById");
const createBusiness = require("./Business/BusinessPost");
const businessSearch = require("./Business/BusinessSearch");
const businessGetAll = require("./Business/BusinessGetAll");
const businessGetById = require("./Business/BusinessGetById");
const businessUpdate = require("./Business/BusinessUpdate");
const businessDelete = require("./Business/BusinessDelete");
const messageWebHook = require("./Message/messageWebhook");
const messageSend = require("./Message/messageSend");
const messageSendSearch = require("./Message/messageSendSearch");
const telegramRoute = require ("./Message/telegramRoute")
const telegramResponse = require('./Message/telegramResponse'); 
const messageGet = require('./Message/messageGet')


const { Router } = require("express");

const routes = Router();

module.exports = (io) => {
  routes.use("/", createBusiness);
  routes.use("/", businessUpdate);
  routes.use("/", businessSearch);
  routes.use("/", businessGetById);
  routes.use("/", businessGetAll);
  routes.use("/", businessDelete);
  routes.use("/", createUser);
  routes.use("/", userSearch);
  routes.use("/", userGetAll);
  routes.use("/", userGetById);
 // routes.use("/", userUpdate);
  routes.use("/", userDelete);
  routes.use("/", messageWebHook(io));
  routes.use("/", messageSend(io));
  routes.use("/", messageSendSearch);
  routes.use("/", telegramRoute);
  routes.use('/', telegramResponse); // Agrega la nueva ruta sendResponse
  routes.use("/", messageGet)
  // routes.use("/", msgFind)
  // routes.use("/", putNotification)
  // routes.use("/", login);
  // routes.use("/",validate)

  return routes;
};
