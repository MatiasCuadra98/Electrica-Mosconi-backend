// controllers/mercadoLibreQuestionsController.js
const axios = require('axios');
const { SocialMediaActive } = require('../../db');

const mercadoLibreQuestionsController = {
  receiveQuestion: async (req, res) => {
    try {
      // El body de la notificación recibida
      const { resource, topic, user_id } = req.body;

      // Verificar si es el evento de "questions"
      if (topic === 'questions') {
        console.log('Nueva pregunta recibida:', resource);

        // Obtener el token de acceso almacenado para hacer la consulta de detalles
        const socialMediaActive = await SocialMediaActive.findOne({ where: { socialMediaId: 5, active: true } });
        const accessToken = socialMediaActive?.accessToken;

        if (!accessToken) {
          return res.status(400).json({ message: 'No se encontró un token de acceso válido.' });
        }

        // Hacer la solicitud a la API de Mercado Libre para obtener detalles de la pregunta
        const questionDetails = await axios.get(`https://api.mercadolibre.com${resource}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        console.log('Detalles de la pregunta:', questionDetails.data);

        // Aquí puedes guardar la pregunta en tu base de datos o hacer lo que necesites
        // Ejemplo: Guardar en la tabla de mensajes o preguntas

        return res.status(200).json({ message: 'Pregunta recibida y procesada correctamente' });
      }

      return res.status(200).json({ message: 'Evento no relevante' });
    } catch (error) {
      console.error('Error al recibir la pregunta:', error.message);
      res.status(500).json({ message: 'Error al procesar la notificación de pregunta' });
    }
  }
};

module.exports = { mercadoLibreQuestionsController };
