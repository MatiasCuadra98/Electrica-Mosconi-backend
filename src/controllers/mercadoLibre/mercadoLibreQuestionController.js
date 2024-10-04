const axios = require("axios");
const { MsgReceived, Contacts, Business, SocialMedia, SocialMediaActive } = require("../../db");
const { mercadoLibreAuthController } = require("./mercadoLibreAuthController");
const { v4: uuidv4 } = require("uuid");

const mercadoLibreQuestionController = {
  getQuestions: async (accessToken, itemId, businessId, socialMediaId) => {
    try {
      if (!itemId) {
        throw new Error("El parámetro itemId en meli es requerido");
      }

      // Obtener el negocio (Business) por ID
      const business = await Business.findByPk(businessId);
      if (!business) {
        throw new Error(`Business con ID en meli${businessId} no encontrado`);
      }

      // Obtener la red social (SocialMedia) por ID
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) {
        throw new Error(`Social Media en meli con ID ${socialMediaId} no encontrada`);
      }
      
      const socialMediaData = socialMedia.dataValues;

      // Llamada a la API de Mercado Libre para obtener las preguntas
      const response = await axios.get(
        "https://api.mercadolibre.com/questions/search",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { item: itemId },
        }
      );

      const questions = response.data.questions;

      // Procesar cada pregunta recibida
      for (const question of questions) {
        const senderIdUser = question.from.id;
        const senderName = question.from.nickname || "Nombre desconocido";
        const chatId = senderIdUser; // Utilizando el ID del usuario como chatId

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

        // Asociar el contacto con el negocio si es creado
        if (created) {
          await newContact.addBusiness(business);
        }

        // Asociar el contacto con la red social si es creado
        if (created && socialMedia) {
          await newContact.setSocialMedia(socialMediaData);
        }

        // Verificar si el contacto fue encontrado o creado
        const contact = await Contacts.findOne({ where: { phone: senderIdUser } });
        if (!contact) {
          throw new Error(`Contact no encontrado para el ID de usuario en meli ${senderIdUser}`);
        }

        // Crear el mensaje recibido y asociar con el negocio, contacto y red social
        const msgReceived = await MsgReceived.create({
          id: uuidv4(),
          chatId: chatId,
          idUser: senderIdUser,
          text: question.text,
          name: senderName,
          timestamp: new Date(question.date_created).getTime(),
          phoneNumber: null, // No hay número de teléfono disponible en las preguntas de Mercado Libre
          BusinessId: businessId,
          state: "No Leidos",
          received: true,
        });

        // Asociar el mensaje recibido con el negocio
        await msgReceived.setBusiness(business);

        // Asociar el mensaje recibido con el contacto
        await msgReceived.setContact(contact);

        // Asociar el mensaje recibido con la red social
        await msgReceived.setSocialMedium(socialMediaData);

        console.log("Mensaje recibido de meli guardado en la base de datos:", msgReceived);
      }

      return questions;
    } catch (error) {
      // Manejo del error por token expirado
      if (error.response && error.response.status === 401) {
        console.log("Token de acceso de meli expirado. Renovando...");

        // Buscar el refresh token en la base de datos
        const socialMediaData = await SocialMediaActive.findOne({ where: { socialMediaId: 5 } });
        const { refreshToken } = socialMediaData;

        // Renovar el access token
        const { accessToken: newAccessToken, newRefreshToken } = await mercadoLibreAuthController.refreshAccessToken(refreshToken);

        // Actualizar el token en la base de datos
        await SocialMediaActive.update(
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          { where: { socialMediaId: 5 } }
        );

        // Reintentar la solicitud con el nuevo token
        return await mercadoLibreQuestionController.getQuestions(newAccessToken, itemId, businessId, socialMediaId);
      }

      console.error("Error al obtener las preguntas de meli:", error);
      throw error;
    }
  },
};

module.exports = { mercadoLibreQuestionController };
