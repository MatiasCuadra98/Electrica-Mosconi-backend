const { mercadoLibreQuestionController } = require('../../controllers/mercadoLibre/mercadoLibreQuestionController');

// Handler para obtener las preguntas de los productos de Mercado Libre
const mercadoLibreQuestionHandler = async (req, res) => {
    try {
        const { accessToken } = req.query; // Suponemos que el token se envía como query
        const questions = await mercadoLibreQuestionController.getQuestions(accessToken);
        return res.json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener preguntas de Mercado Libre' });
    }
};

module.exports = { mercadoLibreQuestionHandler };
