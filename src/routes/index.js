// const login = require('./Login/loginRoute')
// const validate = require('./userValidation/userValidation')
const createUser = require('./User/UserPost')
const userSearch = require('./User/userSearch')
const userUpdate = require('./User/userUpdate')
const userDelete = require('./User/userDelete')
const userGetAll = require('./User/userGetAll')
const userGetById = require('./User/userGetById')
const createBusiness = require('./Business/BusinessPost')
const businessSearch = require('./Business/BusinessSearch')
const businessGetAll = require('./Business/BusinessGetAll')
const businessGetById = require('./Business/BusinessGetById')
const businessUpdate = require('./Business/BusinessUpdate')
const businessDelete = require('./Business/BusinessDelete')
const messageWebHook = require('./Message/messageWebHook')
const messageSend = require('./Message/messageSend')
const messageSendSearch = require('./Message/messageSendSearch')

const {Router} = require('express')

const routes = Router();

module.exports = (io)=>{
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
    routes.use("/", userUpdate);
    routes.use("/", userDelete);
    routes.use("/", messageWebHook(io));
    routes.use("/", messageSend(io)); 
    routes.use("/", messageSendSearch)    
    // routes.use("/", ContactsSearch)
    // routes.use("/", msgFind)
    // routes.use("/", putNotification)
    // routes.use("/", login);
    // routes.use("/",validate)

    return routes
}


