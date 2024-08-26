const TelegramBot = require("node-telegram-bot-api");
const axios = require('axios');
const { MsgReceived, MsgSent, Contacts, Business, SocialMedia, User } = require("../db");

const botToken = "7109913133:AAHFaShef4kAoR48jUUdkY5mifzZ6cSO_94"; 
const bot = new TelegramBot(botToken); // Not using polling here

const businessId = "dcb75f4c-5c96-40c5-befc-3179c96535c2";
const socialMediaId = 1; // Telegram social media ID

// Handler for receiving messages (Webhook and polling can use this)
async function handleIncomingMessage(msg) {
  const chatId = msg.chat.id;
  const message = msg.text;
  const senderName = msg.from.first_name;
  const senderPhone = msg.from.id;

  try {
    const [newContact, created] = await Contacts.findOrCreate({
      where: { phone: senderPhone },
      defaults: {
        name: senderName,
        notification: true,
        chatId: chatId,
      },
    });

    if (created && businessId) {
      const business = await Business.findByPk(businessId);
      if (!business) throw new Error(`Business with id ${businessId} not found`);
      await newContact.addBusiness(business);
    }

    if (created && socialMediaId) {
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) throw new Error(`Social Media with id ${socialMediaId} not found`);
      await newContact.setSocialMedia(socialMedia);
    }

    const contact = await Contacts.findOne({ where: { phone: senderPhone } });
    if (!contact) throw new Error(`Contact not found`);

    const msgReceived = await MsgReceived.create({
      name: senderName,
      chatId: chatId,
      text: message,
      fromData: msg.from,
      payload: msg,
      timestamp: Date.now(),
      BusinessId: businessId,
      active: false,
      state: "No Leidos",
      received: true,
    });

    if (businessId) {
      const business = await Business.findByPk(businessId);
      if (!business) throw new Error(`Business with id ${businessId} not found`);
      await msgReceived.setBusiness(business);
    }

    await msgReceived.setContact(contact);

    if (socialMediaId) {
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) throw new Error(`Social Media with id ${socialMediaId} not found`);
      await msgReceived.setSocialMedium(socialMedia);
    }

    console.log("Mensaje recibido guardado en la base de datos:", msgReceived);

    const msgReceivedData = {
      name: senderName,
      chatId: chatId,
      text: message,
      fromData: msg.from,
      payload: msg,
      timestamp: Date.now(),
      BusinessId: businessId,
      active: false,
      state: "No Leidos",
      received: true,
    };
    
    await axios.post('http://localhost:3000/newMessageReceived', msgReceivedData);
    console.log("Datos del mensaje enviados a app desde TelegramBot");

    // Optional: Send an automatic response
    await bot.sendMessage(chatId, "Hola, ¿cómo estás? ¡Gracias por tu mensaje!");

  } catch (error) {
    console.error("Error al guardar el mensaje recibido en la base de datos:", error);
  }
}

// Use this function in both polling and webhook
bot.on("message", handleIncomingMessage);

// Manual response function
async function enviarRespuestaManual(chatId, mensaje, userId) {
  try {
    await bot.sendMessage(chatId, mensaje);
    const msgSent = await MsgSent.create({
      name: "Matias",
      toData: { app: "Telegram", value: chatId },
      message: mensaje,
      chatId: chatId,
      timestamp: Date.now(),
      BusinessId: businessId,
      received: false,
    });

    const business = await Business.findByPk(businessId);
    if (business) await msgSent.setBusiness(business);

    const messageR = await MsgReceived.findAll({ where: { chatId } });
    if (messageR) await msgSent.addMsgReceived(messageR);

    const contactCreated = await Contacts.findOne({ where: { chatId } });
    if (contactCreated) await msgSent.setContact(contactCreated);

    if (userId) {
      const user = await User.findByPk(userId);
      if (user) await msgSent.setUser(user);
    }

    console.log("Respuesta manual enviada y guardada correctamente.");

    // const msgSentData ={
    //   name: botUsername,
    //   toData: { app: "Telegram", value: chatId },
    //   message: mensaje,
    //   chatId: chatId,
    //   timestamp: Date.now(),
    //   BusinessId: businessId,
    //   received: false,
    //   UserId: userId, 
    //   ContactId: Contacts.id
    // }
    // console.log('respuesta manual: mensaje enviado a app', msgSentData);
    
    // await axios.post('http://localhost:3000/newMessageSent', msgSentData);
    // console.log("Datos del mensaje enviados a app desde TelegramBot");
    return { 
      success: true, 
      message: "Respuesta enviada correctamente",
      msgSent
     };
    
  } catch (error) {
    console.error("Error al enviar y guardar la respuesta manual:", error);
    return { success: false, message: "Error al enviar y guardar la respuesta manual" };
  }
}

module.exports = { bot, enviarRespuestaManual, handleIncomingMessage };
