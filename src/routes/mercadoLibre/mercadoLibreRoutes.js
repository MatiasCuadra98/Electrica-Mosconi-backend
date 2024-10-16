const {Router} = require('express');
const { mercadoLibreAuthHandler, mercadoLibreCallbackHandler  } = require('../../handlers/MercadoLibre/mercadoLibreAuthHandler');
const {mercadoLibreAnswerHandler} = require('../../handlers/MercadoLibre/mercadoLibreAnswerHandler')
const {mercadoLibreQuestionHandler} = require("../../handlers/MercadoLibre/mercadoLibreQuestionsHandler")
const {mercadoLibreRegisterWebhookHandler} = require("../../handlers/MercadoLibre/mercadoLibreQuestionsHandler")
const {mercadoLibreWebhookHandler} = require("../../handlers/MercadoLibre/mercadoLibreQuestionsHandler")

const mercadoLibreRoutes = Router();

// Ruta para iniciar la autenticación de Mercado Libre
mercadoLibreRoutes.get('/auth', mercadoLibreAuthHandler);

// Ruta para manejar el callback de la autenticación
mercadoLibreRoutes.get('/auth/callback', mercadoLibreCallbackHandler );

// Ruta para responder las preguntas de productos
mercadoLibreRoutes.post('/answer', mercadoLibreAnswerHandler);
 
mercadoLibreRoutes.post('/questions', mercadoLibreQuestionHandler);
mercadoLibreRoutes.post('/webhook', mercadoLibreWebhookHandler);
mercadoLibreRoutes.post('/register-webhook', mercadoLibreRegisterWebhookHandler);


module.exports = mercadoLibreRoutes;;
