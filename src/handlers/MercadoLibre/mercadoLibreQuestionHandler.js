const { mercadoLibreQuestionController } = require('../../controllers/mercadoLibre/mercadoLibreQuestionController');
const { SocialMedia, Business } = require('../../db'); 

const businessId = "53c2e647-ce26-41f7-915e-aac13b11c92a";
const socialMediaId = 5;

const mercadoLibreQuestionHandler = async (req, res) => {
    try {
        const { item } = req.query; // Obtenemos solo el parámetro item
        console.log('Received query:', req.query);

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: 'No autorizado' });
        }

        const accessToken = authHeader.split(' ')[1];

        // Validación de parámetros
        if (!item) {
            return res.status(400).json({ message: 'El parámetro item es requerido' });
        }


        // Obtener el business a partir del BusinessId
        const business = await Business.findByPk(businessId);
        if (!business) {
            return res.status(404).json({ message: `Business con ID ${businessId} no encontrado` });
        }
        console.log('Business encontrado:', business);

        // Verificar que el negocio tenga SocialMediumId
        if (!business.SocialMediumId) {
            return res.status(400).json({ message: `SocialMediumId no encontrado para el Business ID ${businessId}` });
        }

        // Obtener la red social correspondiente
        const socialMedia = await SocialMedia.findByPk(business.SocialMediumId);
        if (!socialMedia) {
            return res.status(404).json({ message: `Social Media no encontrado para Business ID ${businessId}` });
        }


        // Llamada al controlador de preguntas de Mercado Libre
        const questions = await mercadoLibreQuestionController.getQuestions(accessToken, item, businessId, socialMediaId);
        console.log('Preguntas recibidas de Mercado Libre:', JSON.stringify(questions, null, 2));

        return res.json(questions);
    } catch (error) {
        console.error('Error al obtener preguntas de Mercado Libre:', error);
        res.status(500).json({ message: 'Error al obtener preguntas de Mercado Libre' });
    }
};

module.exports = { mercadoLibreQuestionHandler };
