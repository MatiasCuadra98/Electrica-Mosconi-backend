const TelegramBot = require("node-telegram-bot-api");
const { MsgReceived, Contacts } = require("../db"); // Importamos los modelos MsgReceived y Contacts

const botToken = "7109913133:AAHFaShef4kAoR48jUUdkY5mifzZ6cSO_94"; // Reemplaza con el token de tu bot

// Inicializar el bot de Telegram
const bot = new TelegramBot(botToken, { polling: true });

// Exportar el bot para que pueda ser utilizado desde otros módulos

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;
  const senderName = msg.from.first_name;
  const senderPhone = msg.from.id; // Usamos el ID del remitente como el número de teléfono en este caso

  // Guardar el mensaje recibido en la base de datos
  try {
    console.log(msg.from);
    const contact = await Contacts.findOne({ where: { phone: senderPhone } });
    if (!contact) {
      // Si el contacto no existe, lo creamos
      await Contacts.create({
        name: senderName,
        phone: senderPhone,
        notification: true, // Establecemos la notificación en verdadero por defecto
      });
    }

    // Guardamos el mensaje recibido en la base de datos
    await MsgReceived.create({
      name: senderName,
      chatId: chatId,
      text: message,
      fromData: msg.from,
      payload: msg, // Almacenamos todo el objeto de mensaje
      timestamp: Date.now(), // Usamos el timestamp actual
    });

    console.log("Mensaje recibido guardado en la base de datos");
  } catch (error) {
    console.error(
      "Error al guardar el mensaje recibido en la base de datos:",
      error
    );
  }

  //Respuesta automatica
  //bot.sendMessage(chatId, "Hola, ¿cómo estás? ¡Gracias por tu mensaje!");
});
//funcion para responder manualmente
async function enviarRespuestaManual(chatId, mensaje) {
  try {
    await bot.sendMessage(chatId, mensaje);
    console.log('Respuesta manual enviada correctamente.');
    return { success: true, message: 'Respuesta enviada correctamente' };
  } catch (error) {
    console.error('Error al enviar la respuesta manual:', error);
    return { success: false, message: 'Error al enviar la respuesta manual' };
  }
}

//module.exports = bot;
module.exports = { bot, enviarRespuestaManual };
