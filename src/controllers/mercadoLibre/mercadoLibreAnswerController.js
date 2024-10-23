const axios = require("axios");
const { MsgReceived, MsgSent, Business, Contacts } = require("../../db");

const mercadoLibreAnswerController = {
  answerQuestion: async (req, res) => {
    const {
      questionId,
      answerText,
      accessToken,
      businessId,
      ContactId,
      userId,
    } = req.body;
    console.log("Cuerpo de la solicitud:", req.body); // Log de depuración para el cuerpo de la solicitud

    try {
      // Validación de datos requeridos
      if (!questionId || !answerText || !accessToken || !businessId) {
        console.error("Datos requeridos faltantes:", {
          questionId,
          answerText,
          accessToken,
          businessId,
          ContactId,
          userId,
        });
        return res.status(400).json({
          message:
            "El ID de la pregunta, el texto de la respuesta, el ID del negocio y el token de acceso son requeridos.",
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

      // Busca el mensaje recibido en la base de datos usando el `chatId` (questionId)
      const msgReceived = await MsgReceived.findOne({
        where: { userName: questionId },
      });
      if (!msgReceived) {
        console.error(
          "Mensaje recibido no encontrado para userName:",
          questionId
        );
        return res
          .status(404)
          .json({ message: "Mensaje recibido no encontrado." });
      }

      // Busca el negocio por su ID
      const business = await Business.findByPk(businessId);
      if (!business) {
        console.error("Negocio no encontrado para businessId:", businessId);
        return res.status(404).json({ message: "Negocio no encontrado!." });
      }

      let contact;
      if (ContactId) {
        contact = await Contacts.findByPk(ContactId);
        if (!contact) {
          return res.status(404).json({ message: "Contacto no encontrado." });
        }
      }

      // Guarda el mensaje enviado en la base de datos
      const msgSent = await MsgSent.create({
        name: "Mercado Libre",
        toData: { app: "Mercado Libre", value: questionId }, // Usando questionId como value
        message: answerText,
        chatId: questionId, // Usar questionId como chatId
        timestamp: new Date(), // Usar un objeto Date
        received: false,
      });

      console.log("MsgSent creado exitosamente:", msgSent.id);

      // Asocia el mensaje enviado con el negocio, contacto y el mensaje recibido
      await msgSent.setBusiness(business);
      if (contact) {
        await msgSent.setContact(contact); // Solo asociamos si `ContactId` está presente
      }
      await msgSent.addMsgReceived(msgReceived);

      // Asociar con el usuario si `userId` fue pasado
      if (userId) {
        const user = await user.findByPk(userId);
        if (!user) {
          return res.status(404).json({ message: `Usuario con id ${userId} no encontrado.` });
        }
        await msgSent.setUser(user);
      }

      // Actualiza el estado del mensaje recibido a "Respondidos"
      msgReceived.state = "Respondidos";
      await msgReceived.save();

      // Respuesta exitosa
      return res.status(200).json({
        message:
          "Respuesta enviada exitosamente y guardada en la base de datos.",
        response: response.data,
      });
    } catch (error) {
      console.error(
        "Error al enviar respuesta a Mercado Libre:",
        error.response ? error.response.data : error.message
      );
      return res.status(500).json({
        message: "Error al enviar respuesta",
        error: error.response ? error.response.data : error.message,
      });
    }
  },
};

module.exports = { mercadoLibreAnswerController };
