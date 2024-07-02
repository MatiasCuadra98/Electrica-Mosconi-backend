// const TelegramBot = require("node-telegram-bot-api");
// const { MsgReceived, MsgSent, Contacts, Business, SocialMedia } = require("../db"); // Importamos los modelos MsgReceived y Contacts

// const botToken = "7109913133:AAHFaShef4kAoR48jUUdkY5mifzZ6cSO_94"; // Reemplaza con el token de tu bot
// // Inicializar el bot de Telegram
// const bot = new TelegramBot(botToken, { polling: true });
// // const bot = new TelegramBot(botToken);

// const businessId = "e96fbc97-b34f-4174-ab59-29c6585b75eb"; // Reemplaza con el BusinessId recibido al crear el negocio
// const socialMediaId = 3
// // Exportar el bot para que pueda ser utilizado desde otros módulos
// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   const message = msg.text;
//   const senderName = msg.from.first_name;
//   const senderPhone = msg.from.id; // Usamos el ID del remitente como el número de teléfono en este caso
//   // Guardar el mensaje recibido en la base de datos
//   console.log('msg: ', msg);
//   try {
//     const [newContact, created] = await Contacts.findOrCreate({
//       where: { phone: senderPhone },
//       defaults: {
//         name: senderName,
//         notification: true,
//         SocialMediumId: socialMediaId
//       },
//     });
//     if (created && businessId) {
//       const business = await Business.findByPk(businessId);
//       if (!business) throw new Error(`Business with id ${businessId} not found`);
//       await newContact.addBusiness(business);
//     }
//     if (created && socialMediaId) {
//       const socialMedia = await SocialMedia.findByPk(socialMediaId);
//       if (!socialMedia) throw new Error(`Social Media with id ${socialMediaId} not found`);
//       await newContact.setSocialMedia(socialMedia);
//     }
//     const contact = newContact ? newContact : Contacts.findOne({where: {phone: senderPhone}})
//     // Guardamos el mensaje recibido en la base de datos
//    const msgReceived = await MsgReceived.create({
//       name: senderName,
//       chatId: chatId,
//       text: message,
//       fromData: msg.from,
//       payload: msg, // Almacenamos todo el objeto de mensaje
//       timestamp: Date.now(), // Usamos el timestamp actual
//       BusinessId: null, //este es el ID de la empresa
//       active: false,
//       state: "No Leidos",
//       received: true,
//     });
//     if (businessId) {
//       const business = await Business.findByPk(businessId);
//       if (!business) throw new Error(`Business with id ${businessId} not found`);
//       await msgReceived.setBusiness(business);
//     };
//     if (contact) {
//       await msgReceived.setContact(contact);
//     } else {
//       throw new Error(`Contact not found`);
//     };

//     if (socialMediaId) {
//       const socialMedia = await SocialMedia.findByPk(socialMediaId);
//       if (!socialMedia) throw new Error(`Business with id ${socialMediaId} not found`);
//       await msgReceived.setSocialMedia(socialMedia);
//     }

//     if (msgReceived) {
//       await contact.setMsgReceived(msgReceived);
//     } else {
//       throw new Error(`Message Received not found`);
//     };
   
// //msgReceived: e3e2ecc1-85dc-4a48-89e0-5f5c66773082 
//     console.log("Mensaje recibido guardado en la base de datos:");
//     console.log('mensaje recibido', msgReceived);
    
//   } catch (error) {
//     console.error(
//       "Error al guardar el mensaje recibido en la base de datos:",
//       error
//     );
//   }

//   //Respuesta automatica
//   bot.sendMessage(chatId, "Hola, ¿cómo estás? ¡Gracias por tu mensaje!");
// });


// // Función para enviar respuestas manuales y guardar en la base de datos
// async function enviarRespuestaManual(chatId, mensaje, userId) {
//   try {
//     // Envía el mensaje
//     await bot.sendMessage(chatId, mensaje);

//     const botUsername = bot.options.username || "Matias";
//     //sin el businessId el mensaje no se guarda en la base de datos

//     // Guarda el mensaje enviado en la base de datos
//     await MsgSent.create({
//       name: botUsername, // Nombre del bot
//       toData: { app: "Telegram", value: chatId }, // Información de destino (ejemplo)
//       message: mensaje,
//       chatId: chatId,
//       timestamp: Date.now(), // Usamos el timestamp actual
//       BusinessId: businessId, // Reemplaza con el ID de tu negocio si es necesario
//       received: false,
//     });

//     // await msgCreated.setBusiness(businessId);
//     // const messageR = MsgReceived.findAll({ where: { chatId } });
//     // await msgCreated.addMsgReceived(messageR);
//     // await msgCreated.setContacts(messageR.Contacts.Id);
//     // userId && msgCreated.setUser(userId);

//     console.log("Respuesta manual enviada y guardada correctamente.");
//     return { success: true, message: "Respuesta enviada correctamente" };
//   } catch (error) {
//     console.error("Error al enviar y guardar la respuesta manual:", error);
//     return {
//       success: false,
//       message: "Error al enviar y guardar la respuesta manual",
//     };
//   }
// }
// //module.exports = bot;
// module.exports = { bot, enviarRespuestaManual };



const TelegramBot = require("node-telegram-bot-api");
const { MsgReceived, MsgSent, Contacts, Business, SocialMedia, User } = require("../db");

const botToken = "7109913133:AAHFaShef4kAoR48jUUdkY5mifzZ6cSO_94"; // Reemplaza con el token de tu bot
const bot = new TelegramBot(botToken, { polling: true });

const businessId = "6b3d981b-2d34-4636-90eb-5b3437a37315"; //34c65bf0-05ea-4329-84b9-90f462bbc177 // Reemplaza con el BusinessId recibido al crear el negocio
const socialMediaId = 3; //este es el id de telegram

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const senderName = msg.from.first_name;
  const senderPhone = msg.from.id;

  console.log('msg: ', msg);

  try {
    // Buscar o crear el contacto
    const [newContact, created] = await Contacts.findOrCreate({
      where: { phone: senderPhone },
      defaults: {
        name: senderName,
        notification: true,
        chatId: chatId, 
        SocialMediumId: socialMediaId
      },
    });

    // Asociar el contacto con el negocio
    if (created && businessId) {
      const business = await Business.findByPk(businessId);
      if (!business) throw new Error(`contact-business: Business with id ${businessId} not found`);
      await newContact.addBusiness(business);
    }

    // Asociar el contacto con la red social
    if (created && socialMediaId) {
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) throw new Error(`contact-socialMedia: Social Media with id ${socialMediaId} not found`);
      await newContact.setSocialMedium(socialMedia);
    }

    const contact = await Contacts.findOne({ where: { phone: senderPhone } });
    if (!contact) throw new Error(`Contact not found`);

    // Crear el mensaje recibido
    const msgReceived = await MsgReceived.create({
      name: senderName,
      chatId: chatId,
      text: message,
      fromData: msg.from,
      payload: msg,
      timestamp: Date.now(),
      BusinessId: null,
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
    await msgReceived.setContact(contact);

    // Asociar el mensaje recibido con la red social
    if (socialMediaId) {
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia) throw new Error(`msgReceived-socialMedia: Social Media with id ${socialMediaId} not found`);
      await msgReceived.setSocialMedium(socialMedia);
    }

    console.log("Mensaje recibido guardado en la base de datos:", msgReceived);
  } catch (error) {
    console.error("Error al guardar el mensaje recibido en la base de datos:", error);
  }

  // Respuesta automática
  bot.sendMessage(chatId, "Hola, ¿cómo estás? ¡Gracias por tu mensaje!");
});

// Función para enviar respuestas manuales y guardar en la base de datos
async function enviarRespuestaManual(chatId, mensaje, userId) {
  try {
    // Envía el mensaje
    await bot.sendMessage(chatId, mensaje);

    const botUsername = bot.options.username || "Matias";

    // Guarda el mensaje enviado en la base de datos
    const msgSent = await MsgSent.create({
      name: botUsername,
      toData: { app: "Telegram", value: chatId },
      message: mensaje,
      chatId: chatId,
      timestamp: Date.now(),
      BusinessId: businessId,
      received: false,
    });

    if (businessId) {
      const business = await Business.findByPk(businessId);
      if (!business) throw new Error(`msgSent-business: Business with id ${businessId} not found`);
      await msgSent.setBusiness(business);
    }

    const messageR = MsgReceived.findAll({ where: { chatId } });
    if(!messageR) throw new Error(`msgSent-msgReceived: Message Received with Chatid ${chatId} not found`);
    await msgSent.addMsgReceived(messageR);

    const contactCreated = await Contacts.findOne({ where: { chatId } });
    if (!contactCreated) throw new Error(`MsgSent-contact: Contact not found`);
    await msgSent.setContact(contactCreated);

    if (userId) {
      const user = await User.findByPk(userId);
      if (!user) throw new Error(`msgSent-user: User with id ${userId} not found`);
      await msgSent.setUser(user);
    }

    console.log("Respuesta manual enviada y guardada correctamente.");
    return { success: true, message: "Respuesta enviada correctamente" };
  } catch (error) {
    console.error("Error al enviar y guardar la respuesta manual:", error);
    return {
      success: false,
      message: "Error al enviar y guardar la respuesta manual",
    };
  }
}

module.exports = { bot, enviarRespuestaManual };
