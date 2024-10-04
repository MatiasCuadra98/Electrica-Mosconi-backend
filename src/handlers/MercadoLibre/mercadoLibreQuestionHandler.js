const { mercadoLibreQuestionController } = require('../../controllers/mercadoLibre/mercadoLibreQuestionController');
const { SocialMedia, Business } = require('../../db'); 

const businessId = "53c2e647-ce26-41f7-915e-aac13b11c92a";
const socialMediaId = 5; // Id de Mercado Libre

const mercadoLibreQuestionHandler = async (req, res) => {
    try {
        const { item } = req.query; 
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const accessToken = authHeader.split(' ')[1];

        // Validación de parámetros
        if (!item) {
            return res.status(400).json({ message: 'El parámetro item es requerido' });
        }

        // Obtener el negocio por su ID
        const business = await Business.findByPk(businessId);
        if (!business) {
            return res.status(404).json({ message: `Business con ID ${businessId} no encontrado` });
        }

        // Obtener la red social por su ID
        const socialMedia = await SocialMedia.findByPk(socialMediaId);
        if (!socialMedia) {
            return res.status(404).json({ message: `Social Media con ID ${socialMediaId} no encontrada` });
        }

        // Llamada al controlador de preguntas de Mercado Libre
        const questions = await mercadoLibreQuestionController.getQuestions(accessToken, item, businessId, socialMediaId);

        return res.json(questions);
    } catch (error) {
        console.error('Error al obtener preguntas de Mercado Libre:', error);
        res.status(500).json({ message: 'Error al obtener preguntas de Mercado Libre' });
    }
};

module.exports = { mercadoLibreQuestionHandler };
