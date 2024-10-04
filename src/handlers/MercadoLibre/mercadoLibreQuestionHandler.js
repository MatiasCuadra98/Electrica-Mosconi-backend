const { mercadoLibreQuestionController } = require('../../controllers/mercadoLibre/mercadoLibreQuestionController');

const mercadoLibreQuestionHandler = async (req, res) => {
    try {
        const { itemId, BusinessId } = req.query;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const accessToken = authHeader.split(' ')[1];
         // Validación de parámetros item y BusinessId
         if (!item) {
            return res.status(400).json({ message: 'El parámetro item es requerido' });
        }
        if (!BusinessId) {
            return res.status(400).json({ message: 'El parámetro BusinessId es requerido' });
        }

        const questions = await mercadoLibreQuestionController.getQuestions(accessToken, itemId, BusinessId);
        console.log('Preguntas recibidas de Mercado Libre:', JSON.stringify(questions, null, 2));

        return res.json(questions);
    } catch (error) {
        console.error('Error al obtener preguntas de Mercado Libre:', error);
        res.status(500).json({ message: 'Error al obtener preguntas de Mercado Libre' });
    }
};

module.exports = { mercadoLibreQuestionHandler };
