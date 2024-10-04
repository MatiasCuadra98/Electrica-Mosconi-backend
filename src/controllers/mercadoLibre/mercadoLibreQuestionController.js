const axios = require("axios");
const { MsgReceived, Contacts, Business, SocialMedia, SocialMediaActive } = require("../../db");
const { mercadoLibreAuthController } = require("./mercadoLibreAuthController");
const { v4: uuidv4 } = require("uuid");

const businessId = "53c2e647-ce26-41f7-915e-aac13b11c92a"; 
const socialMediaId = 5; 

const mercadoLibreQuestionController = {
  getQuestions: async (accessToken, itemId, businessId, socialMediaId) => {
    try {
      if (!itemId) {
        throw new Error("El parámetro itemId en meli es requerido");
      }

      // Obtener el negocio (Business) por ID
      const business = await Business.findByPk(businessId);
      if (!business) {
        throw new Error(`Business con ID en meli ${businessId} no encontrado`);
      }

      // Obtener la red social (SocialMedia) por ID
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) {
        throw new Error(`Social Media en meli con ID ${socialMediaId} no encontrada`);
      }

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

        // Si el contacto fue creado, asociarlo con el negocio y la red social
        if (created) {
          await newContact.addBusiness(business);
          await newContact.setSocialMedium(socialMedia);
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
          state: "No Leídos",
          received: true,
        });

        // Asociar el mensaje recibido con el contacto y la red social
        await msgReceived.setContact(newContact);
        await msgReceived.setSocialMedium(socialMedia);

        console.log("Mensaje recibido de meli guardado en la base de datos:", msgReceived);
      }

      return questions;
    } catch (error) {
      // Manejo del error por token expirado
      if (error.response && error.response.status === 401) {
        console.log("Token de acceso de meli expirado. Renovando...");

        const socialMediaData = await SocialMediaActive.findOne({ where: { socialMediaId: 5 } });
        const { refreshToken } = socialMediaData;

        const { accessToken: newAccessToken, newRefreshToken } = await mercadoLibreAuthController.refreshAccessToken(refreshToken);

        await SocialMediaActive.update(
          { accessToken: newAccessToken, refreshToken: newRefreshToken },
          { where: { socialMediaId: 5 } }
        );

        return await mercadoLibreQuestionController.getQuestions(newAccessToken, itemId, businessId, socialMediaId);
      }

      console.error("Error al obtener las preguntas de meli:", error);
      throw error;
    }
  },
};

module.exports = { mercadoLibreQuestionController };
