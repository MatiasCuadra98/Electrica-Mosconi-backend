// const { mercadoLibreQuestionController } = require('../../controllers/mercadoLibre/mercadoLibreQuestionController');
// const { mercadoLibreAuthController } = require('../../controllers/mercadoLibre/mercadoLibreAuthController');
// const { SocialMediaActive, Business, SocialMedia } = require('../../db');

// const businessId = "53c2e647-ce26-41f7-915e-aac13b11c92a";
// const socialMediaId = 5; // Id de Mercado Libre

// const mercadoLibreWebhookHandler = async (req, res) => {
//   try {
//     // Obtener el cuerpo del webhook enviado por Mercado Libre
//     const { resource, user_id } = req.body;

//     if (!resource || !user_id) {
//       return res.status(400).json({ message: 'Datos incompletos' });
//     }

//     // Buscar el negocio por su ID
//     const business = await Business.findByPk(businessId);
//     if (!business) {
//       return res.status(404).json({ message: `Business con ID ${businessId} no encontrado` });
//     }

//     // Buscar la red social por su ID
//     const socialMedia = await SocialMedia.findByPk(socialMediaId);
//     if (!socialMedia) {
//       return res.status(404).json({ message: `Social Media con ID ${socialMediaId} no encontrada` });
//     }

//     // Obtener el token de acceso desde el modelo SocialMediaActive
//     const socialMediaActive = await SocialMediaActive.findOne({
//       where: {
//         socialMediaId: socialMediaId,
//         active: true,  // Asegurarnos de obtener la red social activa
//       },
//     });

//     if (!socialMediaActive) {
//         return res.status(400).json({ message: 'No se encontró la red social activa' });
//       }

//     if (!socialMediaActive || !socialMediaActive.accessToken) {
//       return res.status(400).json({ message: 'Token de acceso de Mercado Libre no disponible o inactivo' });
//     }

//     let accessToken = socialMediaActive.accessToken;

//     // Verificar si el token debe ser renovado y obtener un nuevo token si es necesario
//     if (!accessToken) {
//       console.log("Token de acceso no disponible. Renovando...");
//       const newTokens = await mercadoLibreAuthController.refreshAccessToken(businessId);
//       accessToken = newTokens.accessToken;

//       if (!accessToken) {
//         return res.status(400).json({ message: 'Error al renovar el token de acceso' });
//       }
//     }

//     const itemId = resource; // El `resource` debería ser el ID del producto para obtener las preguntas

//     // Llamar al controlador para obtener las preguntas del producto
//     const questions = await mercadoLibreQuestionController.getQuestions(accessToken, itemId, businessId, socialMediaId);

//     return res.json(questions);
//   } catch (error) {
//     console.error('Error al recibir webhook de Mercado Libre:', error);
//     return res.status(500).json({ message: 'Error al procesar el webhook de Mercado Libre' });
//   }
// };

// module.exports = { mercadoLibreWebhookHandler };
