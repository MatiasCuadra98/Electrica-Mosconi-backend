const express = require('express');
const { mercadoLibreAuthHandler } = require('../../handlers/MercadoLibre/mercadoLibreAuthHandler');
const { mercadoLibreQuestionHandler } = require('../../handlers/MercadoLibre/mercadoLibreQuestionHandler');

const router = express.Router();

// Ruta para iniciar la autenticación de Mercado Libre
router.get('/auth', mercadoLibreAuthHandler);

// Ruta para manejar el callback de la autenticación
router.get('/auth/callback', mercadoLibreAuthHandler);

// Ruta para obtener las preguntas de productos
router.get('/questions', mercadoLibreQuestionHandler);

module.exports = router;
