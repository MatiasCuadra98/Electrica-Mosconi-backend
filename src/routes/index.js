//en este archivo van las rutas cuando esten creadas
const { Router } = require("express");

const messageWebHook = require('./Message/messageWebHook')


const routes = Router();

module.exports = (io)=>{
    routes.use("/", messageWebHook(io));

    return routes
}
