const { mercadoLibreQuestionController } = require('../../controllers/mercadoLibre/mercadoLibreQuestionController');
const { SocialMedia, Business } = require('../../db'); 

const businessId = "53c2e647-ce26-41f7-915e-aac13b11c92a";
const socialMediaId = 5; // Id de Mercado Libre

const mercadoLibreWebhookHandler = async (req, res) => {
    try {
        // Mercado Libre enviará el evento a través de req.body
        const { resource, user_id } = req.body; 

        if (!resource || !user_id) {
            return res.status(400).json({ message: 'Datos incompletos' });
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

        // Aquí utilizaremos el controlador que ya tienes para obtener los detalles de la pregunta
        const accessToken = business.accessToken; // Necesitarás obtener el token de acceso
        const itemId = resource; // El `resource` debería ser el ID del producto para obtener las preguntas
        
        const questions = await mercadoLibreQuestionController.getQuestions(accessToken, itemId, businessId, socialMediaId);

        return res.json(questions);
    } catch (error) {
        console.error('Error al recibir webhook de Mercado Libre:', error);
        res.status(500).json({ message: 'Error al procesar el webhook de Mercado Libre' });
    }
};

module.exports = { mercadoLibreWebhookHandler };
