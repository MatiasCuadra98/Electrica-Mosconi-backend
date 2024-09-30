const {Router} = require('express');
const { mercadoLibreAuthHandler } = require('../../handlers/MercadoLibre/mercadoLibreAuthHandler');
const { mercadoLibreQuestionHandler } = require('../../handlers/MercadoLibre/mercadoLibreQuestionHandler');

const mercadoLibreRoutes = Router();

// Ruta para iniciar la autenticación de Mercado Libre
mercadoLibreRoutes.get('/auth', mercadoLibreAuthHandler);

// Ruta para manejar el callback de la autenticación
mercadoLibreRoutes.get('/auth/callback', mercadoLibreAuthHandler);

// Ruta para obtener las preguntas de productos
mercadoLibreRoutes.get('/questions', mercadoLibreQuestionHandler);

module.exports = mercadoLibreRoutes;
