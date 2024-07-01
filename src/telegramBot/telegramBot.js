const TelegramBot = require("node-telegram-bot-api");
const { MsgReceived, MsgSent, Contacts, Business } = require("../db"); // Importamos los modelos MsgReceived y Contacts

const botToken = "7109913133:AAHFaShef4kAoR48jUUdkY5mifzZ6cSO_94"; // Reemplaza con el token de tu bot
const bot = new TelegramBot(botToken, { polling: true });

const businessId = "3b68faab-8e9b-4bb9-adf1-e8aa6579acd9"; // Reemplaza con el BusinessId recibido al crear el negocio

bot.on("message", async (msg) => {
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
      },
    });

    await newContact.addBusiness(businessId);

    const newMsgReceived = await MsgReceived.create({
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

    console.log("Mensaje recibido guardado en la base de datos");
  } catch (error) {
    console.error(
      "Error al guardar el mensaje recibido en la base de datos:",
      error
    );
  }

  bot.sendMessage(chatId, "Hola, ¿cómo estás? ¡Gracias por tu mensaje!");
});

async function enviarRespuestaManual(chatId, mensaje, userId) {
  try {
    await bot.sendMessage(chatId, mensaje);

    const botUsername = bot.options.username || "Matias";

    const msgCreated = await MsgSent.create({
      name: botUsername,
      toData: { app: "Telegram", value: chatId },
      message: mensaje,
      chatId: chatId,
      timestamp: Date.now(),
      BusinessId: businessId,
      received: false,
    });

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
