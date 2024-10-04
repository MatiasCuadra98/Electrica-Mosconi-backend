const {Router} = require('express');
const { mercadoLibreAuthHandler, mercadoLibreCallbackHandler  } = require('../../handlers/MercadoLibre/mercadoLibreAuthHandler');
const { mercadoLibreQuestionHandler } = require('../../handlers/MercadoLibre/mercadoLibreQuestionHandler');
const {mercadoLibreAnswerHandler} = require('../../handlers/MercadoLibre/mercadoLibreAnswerHandler')

const mercadoLibreRoutes = Router();

// Ruta para iniciar la autenticación de Mercado Libre
mercadoLibreRoutes.get('/auth', mercadoLibreAuthHandler);

// Ruta para manejar el callback de la autenticación
mercadoLibreRoutes.get('/auth/callback', mercadoLibreCallbackHandler );

// Ruta para obtener las preguntas de productos
mercadoLibreRoutes.get('/questions', mercadoLibreQuestionHandler);

// Ruta para responder las preguntas de productos
mercadoLibreRoutes.post('/answer', mercadoLibreAnswerHandler);
module.exports = mercadoLibreRoutes;;
