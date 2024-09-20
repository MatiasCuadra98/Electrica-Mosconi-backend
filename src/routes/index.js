const { Router } = require("express");
const businessRoute = require("./businessRoutes");
const userRoute = require("./userRoutes");
const contactRoute = require("./contactRoutes");
const { socialMediaRoute } = require("./socialMedia/socialMediaRoutes");
const { allMessagesRoute } = require("./messages/allMessagesRoutes");
const messageWebHook = require("./telegram/messageWebhook");
const messageSend = require("./telegram/messageSend");
const whatsappWebhook = require("./whatsapp/wspMessageWebhook");
const whatsappSendMessage = require("./whatsapp/enviarRespuestaManualWsp");
const fbAuthentication = require("./authentication/facebook/login");
const instagramWebhook = require("./instagram/igWebhook");
const messengerWebhook = require("./messenger/messengerWebhook");
const messengerMessageReceived = require("./messenger/messengerMessageReceived");
const sendMessengerMessage = require ("./messenger/messengerMessageSent")
const mercadolibreAuth  = require ("./mercadoLibre/mercadoLibreAuth")
const mercadolibreCb  = require ("./mercadoLibre/mercadoLibreCallback")
const mercadolibreWebhook  = require ("./mercadoLibre/mercadoLibreWebhook")
const routes = Router();

module.exports = (io) => {
  console.log("Cargando rutas de Instagram...");
  routes.use("/", instagramWebhook);
  routes.use("/business", businessRoute); //ok => llega al handler => llega al controller
  routes.use("/user", userRoute); //ok => llega al handler => llega al controller
  routes.use("/contact", contactRoute); //ok => llega al handler => llega al controller
  routes.use("/socialMedia", socialMediaRoute); //ok =>llega al handler => llega al controller
  routes.use("/message", allMessagesRoute); //ok => llega al handler => llega al controller
  routes.use("/", messageWebHook(io));
  routes.use("/", messageSend(io));
  routes.use("/whatsapp", whatsappWebhook);
  routes.use("/whatsapp", whatsappSendMessage);
  routes.use("/", fbAuthentication);
  routes.use("/messenger", messengerWebhook);
  routes.use("/messenger", messengerMessageReceived);
  routes.use("/messenger", sendMessengerMessage)
  routes.use("/mercadoLibre",mercadolibreAuth)
  routes.use("/mercadoLibre",mercadolibreCb)
  routes.use("/mercadoLibre",mercadolibreWebhook)

  return routes;
};
