const { Router } = require('express');
const { Business, User, MsgReceived, Contacts, SocialMedia } = require('../../db');
const axios = require('axios');

const messageWebHook = Router();

module.exports = (io) => {
  // Ruta para recibir mensajes
  messageWebHook.post('/messageWebHook', async (req, res) => {
    console.log('Webhook alcanzado al recibir un mensaje');
    
    const businessId = "9231c626-a37b-4d89-ae16-fec670c9245b"; 
    const socialMediaId = 1; // ID de Telegram
    
    const { message } = req.body;
    if (!message) {
      console.error('No se recibió un mensaje en el body');
      return res.status(400).send('Bad Request: No hay mensaje en el body');
    }

    const chatId = message.chat.id;
    const messageReceived = message.text;
    const senderName = message.from.first_name;
    const senderIdUser = message.from.id.toString();

    try {
      // Verificar la existencia del negocio
      const business = await Business.findByPk(businessId);
      if (!business) {
        return res.status(404).send('Negocio no encontrado');
      }

      // Verificar la existencia de la red social
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) {
        return res.status(404).send('Red Social no encontrada');
      }
      const socialMediaData = socialMedia.dataValues;

      // Crear o encontrar el contacto
      const [newContact, created] = await Contacts.findOrCreate({
        where: { idUser: senderIdUser },
        defaults: {
          name: senderName,
          notification: true,
          chatId: chatId,
          phone: senderIdUser,
          businessId: businessId,
          SocialMediumId: socialMediaId
        }
      });
      console.log('Contacto creado o encontrado:', newContact.dataValues);

      // Asociar el contacto con el negocio (si fue creado recientemente)
      if (created && business) {
        await newContact.addBusiness(business);
      }

      // Asociar el contacto con la red social (si fue creado recientemente)
      if (created && socialMedia) {
        await newContact.setSocialMedia(socialMediaData);
      }

      // Verificar que el contacto haya sido creado o encontrado
      if (!newContact) {
        console.log('El contacto no fue creado ni encontrado');
        return res.status(500).send('Error interno del servidor');
      }

      // Crear el mensaje recibido
      const msgReceived = await MsgReceived.create({
        chatId: chatId,
        idUser: senderIdUser,
        text: messageReceived,
        name: senderName,
        timestamp: Date.now(),
        phoneNumber: chatId,
        BusinessId: businessId,
        state: "No Leidos",
        received: true
      });
      console.log('Mensaje recibido creado:', msgReceived.dataValues);

      // Asociar el mensaje con el negocio
      await msgReceived.setBusiness(business);

      // Asociar el mensaje con el contacto
      await msgReceived.setContact(newContact);

      // Asociar el mensaje con la red social
      await msgReceived.setSocialMedium(socialMediaData);

      // Formatear los datos del mensaje para enviarlo a la app
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
        state: msgReceived.state,
        received: msgReceived.received,
        ContactId: newContact.id,
        Contact: {
          id: newContact.id,
          name: newContact.name,
          phone: newContact.phone
        },
        SocialMediumId: socialMediaId,
        SocialMedium: {
          id: socialMediaId,
          name: socialMedia.name,
          icon: socialMedia.icon
        }
      };

      // Enviar el mensaje a la app
      try {
        await axios.post('https://electrica-mosconi-server.onrender.com/newMessageReceived', msgReceivedData);
        console.log("Datos del mensaje enviados a la app desde Webhook");
      } catch (error) {
        console.error("Error al enviar los datos del mensaje a la app:", error.message);
      }

      res.status(200).end();
    } catch (error) {
      console.error('Error al procesar el mensaje en el webhook:', error);
      res.status(500).send('Error interno del servidor');
    }
  });

  return messageWebHook;
};
