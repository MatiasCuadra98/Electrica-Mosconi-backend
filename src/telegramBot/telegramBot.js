const TelegramBot = require("node-telegram-bot-api");
const { MsgReceived, MsgSent, Contacts, Business } = require("../db"); // Importamos los modelos MsgReceived y Contacts

const botToken = "7109913133:AAHFaShef4kAoR48jUUdkY5mifzZ6cSO_94"; // Reemplaza con el token de tu bot
// Inicializar el bot de Telegram
const bot = new TelegramBot(botToken, { polling: true });
// const bot = new TelegramBot(botToken);

const businessId = "e96fbc97-b34f-4174-ab59-29c6585b75eb"; // Reemplaza con el BusinessId recibido al crear el negocio

// Exportar el bot para que pueda ser utilizado desde otros módulos
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const senderName = msg.from.first_name;
  const senderPhone = msg.from.id; // Usamos el ID del remitente como el número de teléfono en este caso
  // Guardar el mensaje recibido en la base de datos
  try {
    console.log(msg.from);
    // const contact = await Contacts.findOne({ where: { phone: senderPhone } });
    // if (!contact) {
    //   // Si el contacto no existe, lo creamos
    //    await Contacts.create({
    //     name: senderName,
    //     phone: senderPhone,
    //     notification: true, // Establecemos la notificación en verdadero por defecto
    //   });
    // }
    const [newContact, created] = await Contacts.findOrCreate({
      where: { phone: senderPhone },
      defaults: {
        name: senderName,
        notification: true,
      },
    });

    await newContact.addBusiness(businessId);
    await newContact.setSocialMedia(msg.from);
    // Guardamos el mensaje recibido en la base de datos
    await MsgReceived.create({
      name: senderName,
      chatId: chatId,
      text: message,
      fromData: msg.from,
      payload: msg, // Almacenamos todo el objeto de mensaje
      timestamp: Date.now(), // Usamos el timestamp actual
      BusinessId: null, //este es el ID de la empresa
      active: false,
      state: "No Leidos",
      received: true,
    });
    await MsgReceived.setBusiness(businessId);
    await MsgReceived.setContact(newContact);
    await MsgReceived.setSocialMedia({ where: { name: msg.from } });
    await newContact.setMsgReceived(MsgReceived);

    console.log("Mensaje recibido guardado en la base de datos");
  } catch (error) {
    console.error(
      "Error al guardar el mensaje recibido en la base de datos:",
      error
    );
  }

  //Respuesta automatica
  bot.sendMessage(chatId, "Hola, ¿cómo estás? ¡Gracias por tu mensaje!");
});

//funcion para responder manualmente

// async function enviarRespuestaManual(chatId, mensaje) {
//   try {
//     await bot.sendMessage(chatId, mensaje);
//     console.log('Respuesta manual enviada correctamente.');
//     return { success: true, message: 'Respuesta enviada correctamente' };
//   } catch (error) {
//     console.error('Error al enviar la respuesta manual:', error);
//     return { success: false, message: 'Error al enviar la respuesta manual' };
//   }
//}

// Función para enviar respuestas manuales y guardar en la base de datos
async function enviarRespuestaManual(chatId, mensaje, userId) {
  try {
    // Envía el mensaje
    await bot.sendMessage(chatId, mensaje);

    const botUsername = bot.options.username || "Matias";
    //sin el businessId el mensaje no se guarda en la base de datos

    // Guarda el mensaje enviado en la base de datos
    await MsgSent.create({
      name: botUsername, // Nombre del bot
      toData: { app: "Telegram", value: chatId }, // Información de destino (ejemplo)
      message: mensaje,
      chatId: chatId,
      timestamp: Date.now(), // Usamos el timestamp actual
      BusinessId: businessId, // Reemplaza con el ID de tu negocio si es necesario
      received: false,
    });

    await msgCreated.setBusiness(businessId);
    const messageR = MsgReceived.findAll({ where: { chatId } });
    await msgCreated.addMsgReceived(messageR);
    await msgCreated.setContacts(messageR.Contacts.Id);
    userId && msgCreated.setUser(userId);

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
//module.exports = bot;
module.exports = { bot, enviarRespuestaManual };
