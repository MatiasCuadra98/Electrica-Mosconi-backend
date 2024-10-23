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
    console.log("ContactId recibido:", ContactId); // Depurar ContactId
    console.log("userId recibido:", userId); // Depurar userId
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
      console.log("msgReceived encontrado:", msgReceived.id); // Verificar que el mensaje recibido fue encontrado

      // Busca el negocio por su ID
      const business = await Business.findByPk(businessId);
      if (!business) {
        console.error("Negocio no encontrado para businessId:", businessId);
        return res.status(404).json({ message: "Negocio no encontrado!." });
      }
      console.log("Negocio encontrado:", business.id); // Verificar que el negocio fue encontrado

     // Busca el contacto por su ID si `ContactId` fue proporcionado
     let contact;
     if (ContactId) {
       contact = await Contacts.findByPk(ContactId);
       if (!contact) {
         return res.status(404).json({ message: "Contacto no encontrado." });
       }
       console.log("Contacto encontrado:", contact.id); // Verificar que el contacto fue encontrado
     } else {
       console.log("ContactId no proporcionado"); // Si no hay ContactId en el request
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
      console.log("Asociado con el negocio:", business.id); // Confirmar que se asoció con el negocio

      if (contact) {
        await msgSent.setContact(contact); // Solo asociamos si `ContactId` está presente
        console.log("Asociado con el contacto:", contact.id); // Confirmar que se asoció con el contacto

      }
      await msgSent.addMsgReceived(msgReceived);
      console.log("Asociado con el mensaje recibido:", msgReceived.id); // Confirmar que se asoció con el mensaje recibido

      // Asociar con el usuario si `userId` fue pasado
      if (userId) {
        const user = await User.findByPk(userId);
        if (!user) {
          return res.status(404).json({ message: `Usuario con id ${userId} no encontrado.` });
        }
        await msgSent.setUser(user);
        console.log("Asociado con el usuario:", user.id); // Confirmar que se asoció con el usuario
      } else {
        console.log("userId no proporcionado"); // Si no hay userId en el request
      }

      // Actualiza el estado del mensaje recibido a "Respondidos"
      msgReceived.state = "Respondidos";
      await msgReceived.save();
      console.log("Estado del mensaje recibido actualizado a 'Respondidos'"); // Confirmar que el estado fue actualizado

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
