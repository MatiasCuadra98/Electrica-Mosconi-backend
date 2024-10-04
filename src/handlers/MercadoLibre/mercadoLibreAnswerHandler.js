// routes/mercadoLibre/mercadoLibreAnswerHandler.js
const { mercadoLibreAnswerController } = require('../../controllers/mercadoLibre/mercadoLibreAnswerController');

const mercadoLibreAnswerHandler = async (req, res) => {
  await mercadoLibreAnswerController.answerQuestion(req, res);
};

module.exports = { mercadoLibreAnswerHandler };
