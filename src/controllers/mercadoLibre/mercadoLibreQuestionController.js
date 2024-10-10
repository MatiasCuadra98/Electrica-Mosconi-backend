const axios = require("axios");
const { MsgReceived, Contacts, Business, SocialMedia } = require("../../db");
const { mercadoLibreAuthController } = require("./mercadoLibreAuthController");
const { v4: uuidv4 } = require("uuid");

const mercadoLibreQuestionController = {
  getQuestions: async (accessToken, itemId, businessId, socialMediaId) => {
    try {
      if (!itemId) {
        throw new Error("El parámetro itemId en Mercado Libre es requerido");
      }

      // Obtener el negocio (Business) por ID
      const business = await Business.findByPk(businessId);
      if (!business) {
        throw new Error(`Business con ID ${businessId} no encontrado`);
      }

      // Obtener la red social (SocialMedia) por ID
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) {
        throw new Error(`Social Media con ID ${socialMediaId} no encontrada`);
      }
      // Asegurarse de que el accessToken esté presente
      if (!accessToken) {
        throw new Error("Token de acceso de Mercado Libre no disponible");
      }
      // Llamada a la API de Mercado Libre para obtener las preguntas
      const response = await axios.post(
        "https://api.mercadolibre.com/questions/search",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // Añadido para evitar errores 400
          },

          params: { item: itemId },
        }
      );
      console.log("Respuesta de Mercado Libre:", response.data);

      const questions = response.data.questions;

      for (const question of questions) {
        const senderIdUser = question.from.id;
        const senderName = question.from.nickname || "Nombre desconocido";
        const chatId = senderIdUser;

        // Buscar o crear el contacto relacionado a la pregunta
        const [newContact, created] = await Contacts.findOrCreate({
          where: { idUser: senderIdUser },
          defaults: {
            name: senderName,
            notification: true,
            chatId: chatId,
            phone: senderIdUser,
            businessId: businessId,
            SocialMediumId: socialMediaId,
          },
        });

        // Asociar el contacto con el negocio
        if (created) {
          await newContact.addBusiness(business);
        }

        // Asociar el contacto con la red social
        await newContact.setSocialMedium(socialMedia);

        // Crear el mensaje recibido y asociarlo con el negocio y la red social
        const msgReceived = await MsgReceived.create({
          id: uuidv4(),
          chatId: chatId,
          idUser: question.id,
          text: question.text,
          name: senderName,
          timestamp: new Date(question.date_created).getTime(),
          phoneNumber: null,
          BusinessId: businessId,
          state: "No Leidos",
          received: true,
        });

        // Asociar el mensaje con el contacto y la red social
        await msgReceived.setContact(newContact);
        await msgReceived.setSocialMedium(socialMedia);

        console.log(
          "Mensaje recibido de Mercado Libre guardado en la base de datos:",
          msgReceived
        );
      }

      return questions; // Devolvemos las preguntas obtenidas
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Token de acceso de Mercado Libre expirado. Renovando...");

        const { refreshToken } =
          await mercadoLibreAuthController.refreshAccessToken();
        const newAccessToken = refreshToken.accessToken;

        return await mercadoLibreQuestionController.getQuestions(
          newAccessToken,
          itemId,
          businessId,
          socialMediaId
        );
      }

      console.error("Error al obtener las preguntas de Mercado Libre:", error);
      throw error;
    }
  },
};

module.exports = { mercadoLibreQuestionController };
