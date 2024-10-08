const axios = require("axios");
const { MsgReceived, MsgSent } = require("../../db");

const mercadoLibreAnswerController = {
  answerQuestion: async (req, res) => {
    const { questionId, answerText, accessToken } = req.body;

    try {
      // Validación de datos requeridos
      if (!questionId || !answerText || !accessToken) {
        return res.status(400).json({
          message: "El ID de la pregunta, el texto de la respuesta y el token de acceso son requeridos.",
        });
      }

      // Llamada a la API de Mercado Libre para enviar la respuesta
      const response = await axios.post(
        `https://api.mercadolibre.com/answers?access_token=${accessToken}`,
        {
          question_id: questionId,
          text: answerText,
        }
      );

      // Actualiza el estado del mensaje en la base de datos solo si la respuesta es exitosa
      const msgReceived = await MsgReceived.findOne({ where: { idUser: questionId } });
      if (msgReceived) {
        msgReceived.state = "Respondidos"; // Cambia el estado a "Respondidos"
        await msgReceived.save();

        // Guarda el mensaje enviado en la base de datos
        const msgSent = await MsgSent.create({
          name: "Mercado Libre",
          toData: { app: "Mercado Libre", value: questionId },
          message: answerText,
          chatId: msgReceived.chatId, // Usar questionId como chatId si es apropiado
          timestamp: Date.now(),
          received: false,
        });

        // Asocia el mensaje enviado con el mensaje recibido
        await msgSent.addMsgReceived(msgReceived);
      }

      // Respuesta exitosa
      return res.status(200).json({
        message: "Respuesta enviada exitosamente",
        response: response.data,
      });
    } catch (error) {
      console.error('Error al enviar respuesta a Mercado Libre:', error.response ? error.response.data : error.message);
      return res.status(500).json({
        message: 'Error al enviar respuesta',
        error: error.response ? error.response.data : error.message
      });
    }
  },
};

module.exports = { mercadoLibreAnswerController };
