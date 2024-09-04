const { MsgReceived, MsgSent, Contacts, Business, SocialMedia, User } = require("../db");
const axios = require('axios');
require("dotenv").config();


const businessId = "1dc868d6-70b4-4de0-91ee-495f4486d3ea"; 
const socialMediaId = 2; // Este es el id de WhatsApp en SocialMedia
const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN; // Usa tu token de WhatsApp Business API
const BUSINESS_PHONE_NUMBER_ID  = process.env.BUSINESS_PHONE_NUMBER_ID || 372206589314811;


const handleMessage = async (msg) => {
  console.log('Mensaje recibido:', msg);
  const chatId = msg.from;
  const message = msg.text.body;
  const senderPhoneNumber = msg.entry.changes.value.metadata.display_phone_number
  const senderName = msg.from_name ? msg.from_name.toString() : senderPhoneNumber ? senderPhoneNumber : 'Usuario';
  try {
    const business = await Business.findByPk(businessId)
    if (!business) {
      return res.status(404).send('Business no encontrado');
    };
    const socialMedia = await SocialMedia.findByPk(socialMediaId);
    if (!socialMedia) {
      return res.status(404).send('Social Media no encontrado');
    }
    // Buscar o crear el contacto
    const [newContact, created] = await Contacts.findOrCreate({
      where: { idUser: chatId },
      defaults: {
        name: senderName,
        notification: true,
        chatId: chatId,
        phone: senderPhoneNumber,
        businessId: businessId,
        SocialMediumId: socialMediaId,
      },
    });

    // Asociar el contacto con el negocio
    if (created && business) {
      // const business = await Business.findByPk(businessId);
      // if (!business) throw new Error(`contact-business: Business with id ${businessId} not found`);
      await newContact.addBusiness(business);
    }

    // Asociar el mensaje recibido con la red social
    if (created && socialMedia) {
      // const socialMedia = await SocialMedia.findByPk(socialMediaId);
      // if (!socialMedia) throw new Error(`contact-socialMedia: Social Media with id ${socialMediaId} not found`);
      await newContact.setSocialMedium(socialMedia);
    }

    // Crear el mensaje recibido
    const msgReceived = await MsgReceived.create({
      chatId: chatId,
      idUser: msg.id,
      text: message,
      name: senderName.toString(),
      timestamp: Date.now(),
      phoneNumber:senderPhoneNumber,
      BusinessId: businessId,
      // active: false,
      // state: "No Leidos",
      // received: true,
    });

    // Asociar el mensaje recibido con el negocio
    if (business) {
      // const business = await Business.findByPk(businessId);
      // if (!business) throw new Error(`msgReceived-business: Business with id ${businessId} not found`);
      await msgReceived.setBusiness(business);
    }

    // Asociar el mensaje recibido con el contacto
    await msgReceived.setContact(newContact);

    // Asociar el mensaje recibido con la red social
    if (socialMedia) {
      // const socialMedia = await SocialMedia.findByPk(socialMediaId);
      // if (!socialMedia) throw new Error(`msgReceived-socialMedia: Social Media with id ${socialMediaId} not found`);
      await msgReceived.setSocialMedium(socialMedia);
    }

    console.log("Mensaje de WhatsApp recibido guardado en la base de datos:", msgReceived);
   
    const msgReceivedData = {
      id: msgReceived.id,
      chatId: msgReceived.chatId,
      idUser: msgReceived.idUser,
      text: msgReceived.text,
      name: msgReceived.name,
      timestamp: msgReceived.timestamp,
      phoneNumber: msgReceived.phoneNumber,
      BusinessId: businessId,
      Business: {
        id: Business.id,
        name: Business.name
      },
      active: false,
      state: "No Leidos",
      received: true,
      ContactId: Contacts.id,
      Contact: {
        id: Contacts.id,
        name: Contacts.name,
        phone: Contacts.phone,
      },
      SocialMediumId: socialMediaId,
      SocialMedium: {
        id: socialMediaId,
        name: SocialMedia.name,
        icon: SocialMedia.icon
      }
    };
    console.log('mensaje enviado a app', msgReceivedData);
    

    await axios.post('https://electrica-mosconi-server.onrender.com/newMessageReceived', msgReceivedData);
    console.log("Datos del mensaje enviados a app desde Wathsapp");

  } catch (error) {
    console.error("Error al guardar el mensaje de WhatsApp recibido en la base de datos:", error);
  }
};

// Función para enviar mensajes de WhatsApp
const sendMessage = async (to, message) => {
  console.log("Business phone id :", BUSINESS_PHONE_NUMBER_ID );

  try {
    const response = await axios.post(`https://graph.facebook.com/v20.0/372206589314811/messages`, {
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
