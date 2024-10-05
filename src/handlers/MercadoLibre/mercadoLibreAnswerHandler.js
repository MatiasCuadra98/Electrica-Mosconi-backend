const { mercadoLibreAnswerController } = require('../../controllers/mercadoLibre/mercadoLibreAnswerController');

const mercadoLibreAnswerHandler = async (req, res) => {
  try {
    await mercadoLibreAnswerController.answerQuestion(req, res);
  } catch (error) {
    console.error('Error en el handler de respuesta de Mercado Libre:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { mercadoLibreAnswerHandler };
