const { mercadoLibreQuestionController } = require('../../controllers/mercadoLibre/mercadoLibreQuestionController');
const { SocialMedia } = require('../../db'); 

const mercadoLibreQuestionHandler = async (req, res) => {
    try {
        const { item, BusinessId } = req.query;
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

        // Obtener el socialMediaId a partir del BusinessId
        const business = await Business.findByPk(BusinessId);
        if (!business) {
            return res.status(404).json({ message: `Business con ID ${BusinessId} no encontrado` });
        }
        
        // Aquí asumimos que la relación entre Business y SocialMedia está definida correctamente
        const socialMedia = await SocialMedia.findOne({ where: { id: business.SocialMediumId } }); // O lo que corresponda a tu lógica
        if (!socialMedia) {
            return res.status(404).json({ message: `Social Media no encontrado para Business ID ${BusinessId}` });
        }

        const socialMediaId = socialMedia.id; // Asegúrate de obtener el ID correcto

        const questions = await mercadoLibreQuestionController.getQuestions(accessToken, item, BusinessId, socialMediaId);
        console.log('Preguntas recibidas de Mercado Libre:', JSON.stringify(questions, null, 2));

        return res.json(questions);
    } catch (error) {
        console.error('Error al obtener preguntas de Mercado Libre:', error);
        res.status(500).json({ message: 'Error al obtener preguntas de Mercado Libre' });
    }
};

module.exports = { mercadoLibreQuestionHandler };
