const axios = require('axios');
const { MsgReceived, MsgSent } = require('../../db'); 

const mercadoLibreAnswerController = {
  answerQuestion: async (req, res) => {
    const { questionId, answerText, accessToken } = req.body;

    try {
      if (!questionId || !answerText) {
        return res.status(400).json({ message: 'El ID de la pregunta y el texto de la respuesta son requeridos.' });
      }

      // Llamada a la API de Mercado Libre para enviar la respuesta
      const response = await axios.post(
        `https://api.mercadolibre.com/questions/${questionId}/answers`,
        {
          text: answerText,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // Si la respuesta es exitosa, actualiza el estado del mensaje en la base de datos
      const msgReceived = await MsgReceived.findOne({ where: { id: questionId } });
      if (msgReceived) {
        msgReceived.state = 'Respondidos'; // Cambia el estado a "Respondidos"
        await msgReceived.save();
        
        // Guarda el mensaje enviado en la base de datos
        const msgSent = await MsgSent.create({
          name: 'name de Mercado Libre', 
          toData: { app: "Mercado Libre", value: questionId },
          message: answerText,
          chatId: questionId, // Usar questionId como chatId si es apropiado
          timestamp: Date.now(),
          received: false,
        });

        // Asocia el mensaje enviado con el mensaje recibido
        await msgSent.addMsgReceived(msgReceived);
      }

      return res.status(200).json({ message: 'Respuesta enviada exitosamente', response: response.data });
    } catch (error) {
      console.error('Error al enviar respuesta a Mercado Libre:', error);
      return res.status(500).json({ message: 'Error al enviar respuesta', error: error.message });
    }
  },
};

module.exports = { mercadoLibreAnswerController };
