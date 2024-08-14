const { MsgReceived, MsgSent, Contacts, Business, SocialMedia, User } = require("../db");
const axios = require('axios');
require("dotenv").config();


const businessId = "dcb75f4c-5c96-40c5-befc-3179c96535c2"; 
const socialMediaId = 2; // Este es el id de WhatsApp en SocialMedia
const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN; // Usa tu token de WhatsApp Business API
const BUSINESS_PHONE_NUMBER_ID = process.env.BUSINESS_PHONE_NUMBER_ID;


const handleMessage = async (msg) => {
  const chatId = msg.from;
  const message = msg.text.body;
  const senderName = msg.from_name ? msg.from_name.toString() : "Usuario";

  try {
    // Buscar o crear el contacto
    const [newContact, created] = await Contacts.findOrCreate({
      where: { phone: chatId },
      defaults: {
        name: senderName,
        notification: true,
        chatId: chatId,
        SocialMediumId: socialMediaId,
      },
    });

    // Asociar el contacto con el negocio
    if (created && businessId) {
      const business = await Business.findByPk(businessId);
      if (!business) throw new Error(`contact-business: Business with id ${businessId} not found`);
      await newContact.addBusiness(business);
    }

    // Asociar el mensaje recibido con la red social
    if (created && socialMediaId) {
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) throw new Error(`contact-socialMedia: Social Media with id ${socialMediaId} not found`);
      await newContact.setSocialMedium(socialMedia);
    }

    // Crear el mensaje recibido
    const msgReceived = await MsgReceived.create({
      name: senderName.toString(),
      chatId: chatId,
      text: message,
      fromData: msg,
      payload: msg,
      timestamp: Date.now(),
      BusinessId: businessId,
      active: false,
      state: "No Leidos",
      received: true,
    });

    // Asociar el mensaje recibido con el negocio
    if (businessId) {
      const business = await Business.findByPk(businessId);
      if (!business) throw new Error(`msgReceived-business: Business with id ${businessId} not found`);
      await msgReceived.setBusiness(business);
    }

    // Asociar el mensaje recibido con el contacto
    await msgReceived.setContact(newContact);

    // Asociar el mensaje recibido con la red social
    if (socialMediaId) {
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) throw new Error(`msgReceived-socialMedia: Social Media with id ${socialMediaId} not found`);
      await msgReceived.setSocialMedium(socialMedia);
    }

    console.log("Mensaje de WhatsApp recibido guardado en la base de datos:", msgReceived);

    // Respuesta automática
    await sendMessage(chatId, "Hola, ¿cómo estás? ¡Gracias por tu mensaje!");
  } catch (error) {
    console.error("Error al guardar el mensaje de WhatsApp recibido en la base de datos:", error);
  }
};

// Función para enviar mensajes de WhatsApp
const sendMessage = async (to, message) => {
  try {
    const response = await axios.post(`https://graph.facebook.com/v20.0/${BUSINESS_PHONE_NUMBER_ID}/messages`, {
      messaging_product: "whatsapp",
      to: to,
      text: { body: message }
    }, {
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        "Content-Type": "application/json"
      }
    });
    console.log("Mensaje de WhatsApp enviado:", response.data);
  } catch (error) {
    console.error("Error al enviar mensaje de WhatsApp:", error.response ? error.response.data : error.message);
  }
};

module.exports = { handleMessage, sendMessage };
