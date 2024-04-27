// const login = require('./Login/loginRoute')
// const validate = require('./userValidation/userValidation')
const createUser = require('./User/UserPost')
const userSearch = require('./User/userSearch')
const userUpdate = require('./User/userUpdate')
const userDelete = require('./User/userDelete')
const createBusiness = require('./Business/BusinessPost')
const businessSearch = require('./Business/BusinessSearch')
const businessUpdate = require('./Business/BusinessUpdate')
const businessDelete = require('./Business/BusinessDelete')
const {Router} = require('express')

const routes = Router();

module.exports = (io)=>{
    routes.use("/", createBusiness);
    routes.use("/", businessUpdate);
    routes.use("/", businessSearch);
    routes.use("/", businessDelete);
    routes.use("/", createUser);
    routes.use("/", userSearch);
    routes.use("/", userUpdate);
    routes.use("/", userDelete);
    // routes.use("/", messageWebHook(io));
    // routes.use("/", messageSend(io)); 
    // routes.use("/", ContactsSearch)
    // routes.use("/", msgFind)
    // routes.use("/", putNotification)
    // routes.use("/", messageSendSearch)    
    // routes.use("/", login);
    // routes.use("/",validate)

    return routes
}


