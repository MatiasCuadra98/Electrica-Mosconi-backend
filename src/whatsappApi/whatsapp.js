const { MsgReceived, MsgSent, Contacts, Business, SocialMedia, User } = require("../db");
const axios = require('axios');
require("dotenv").config();


const businessId = "9231c626-a37b-4d89-ae16-fec670c9245b"; 
const socialMediaId = 2; // Este es el id de WhatsApp en SocialMedia
const GRAPH_API_TOKEN = process.env.GRAPH_API_TOKEN; // Usa tu token de WhatsApp Business API
const BUSINESS_PHONE_NUMBER_ID  = process.env.BUSINESS_PHONE_NUMBER_ID || 372206589314811;


const handleMessage = async (messageAllData) => {
 
    const msg = messageAllData.messages[0];
    console.log('datos mensaje: ', msg);
    const dataContact = messageAllData.contacts[0]
    console.log('datos contacto: ', dataContact);

      const chatId = msg.from  //deberia se  msg.id, pero hayque cambiar el modelo contacto, ya que es un string y no un numero(bigInt)
      const message = msg.text.body;
      const senderPhoneNumber= msg.from;
      const senderUserId = dataContact.wa_id ? dataContact.wa_id : chatId 
      const senderName = dataContact.profile ? dataContact.profile.name : senderPhoneNumber ? senderPhoneNumber : 'Usuario'
  
  try {
    const business = await Business.findByPk(businessId)
    if (!business) {
      return res.status(404).send('Business no encontrado');
    };
    const socialMedia = await SocialMedia.findByPk(socialMediaId);
    if (!socialMedia) {
      return res.status(404).send('Social Media no encontrado');
    }
    // console.log('red social desde waths:', socialMedia);
    // console.log('red social desde waths-dataValues:', socialMedia.dataValues);
    const socialMediaData = socialMedia.dataValues;
    
    // Buscar o crear el contacto
    const [newContact, created] = await Contacts.findOrCreate({
      where: { idUser: senderUserId },
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
      await newContact.setSocialMedium(socialMediaId);
    }

    //console.log('nuevo contacto desde waths:', newContact);  
        const contact = await Contacts.findOne({ where: { phone: senderUserId  } });
        if (!contact) throw new Error(`Contact not found`);


    // Crear el mensaje recibido
    const msgReceived = await MsgReceived.create({
      chatId: chatId,
      idUser: senderUserId,
      text: message,
      name: senderName,
      timestamp: Date.now(),
      phoneNumber:senderPhoneNumber,
      BusinessId: businessId,
      // active: false,
      state: "No Leidos",
      received: true,
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
      await msgReceived.setSocialMedium(socialMediaId);
    }

    console.log("Mensaje de WhatsApp recibido guardado en la base de datos:");
   
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
        id: business.id,
        name: business.name
      },
      // active: false,
      state: "No Leidos",
      received: true,
      ContactId: contact.id,
      Contact: {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
      },
      SocialMediumId: socialMediaId,
      SocialMedium: {
        id: socialMediaId,
        name: socialMediaData.name,
        icon: socialMediaData.icon
      }
    };
    console.log('mensaje enviado a app', msgReceivedData);
    

    await axios.post('https://electrica-mosconi-server.onrender.com/newMessageReceived', msgReceivedData);
    //console.log("Datos del mensaje enviados a app desde Wathsapp");

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
