// const { mercadoLibreWebhookController } = require('../../controllers/mercadoLibre/mercadoLibreWebhookController');
// const { Business, SocialMedia } = require('../../db'); 

// const businessId = "53c2e647-ce26-41f7-915e-aac13b11c92a";//id del business 
// const socialMediaId = 5; // ID de Mercado Libre

// const mercadoLibreWebhookHandler = async (req, res) => {
//     try {
//         const webhookData = req.body;
//         const authHeader = req.headers.authorization;

//         if (!authHeader) {
//             return res.status(401).json({ message: 'No autorizado' });
//         }

//         const accessToken = authHeader.split(' ')[1];

//         // Validación de datos del webhook
//         if (!webhookData || !webhookData.id) {
//             return res.status(400).json({ message: 'Datos del webhook incompletos' });
//         }

//         // Obtener el negocio por su ID
//         const business = await Business.findByPk(businessId);
//         if (!business) {
//             return res.status(404).json({ message: `Business con ID ${businessId} no encontrado` });
//         }

//         // Obtener la red social por su ID
//         const socialMedia = await SocialMedia.findByPk(socialMediaId);
//         if (!socialMedia) {
//             return res.status(404).json({ message: `Social Media con ID ${socialMediaId} no encontrada` });
//         }

//         // Llamada al controlador del webhook para procesar y guardar la pregunta
//         const savedQuestion = await mercadoLibreWebhookController.processQuestionWebhook(
//             webhookData,
//             businessId,
//             socialMediaId
//         );

//         return res.json(savedQuestion); // Devolvemos la pregunta guardada
//     } catch (error) {
//         console.error('Error al procesar el webhook de Mercado Libre:', error);
//         res.status(500).json({ message: 'Error al procesar el webhook de Mercado Libre' });
//     }
// };

// module.exports = { mercadoLibreWebhookHandler };
