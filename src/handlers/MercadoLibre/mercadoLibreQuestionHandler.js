const { mercadoLibreQuestionController } = require('../../controllers/mercadoLibre/mercadoLibreQuestionController');

const mercadoLibreQuestionHandler = async (req, res) => {
    try {
        const { itemId } = req.query;
        const accessToken = req.headers.authorization; // O de donde estés obteniendo el token

        if (!accessToken) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const questions = await mercadoLibreQuestionController.getQuestions(accessToken, itemId);
        return res.json(questions);
    } catch (error) {
        console.error('Error al obtener preguntas de Mercado Libre:', error);
        res.status(500).json({ message: 'Error al obtener preguntas de Mercado Libre' });
    }
};

module.exports = { mercadoLibreQuestionHandler };
