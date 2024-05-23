require("dotenv").config();
const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { PORT } = process.env;
const bot = require("./src/telegramBot/telegramBot.js")

server.listen(PORT, async () => {
  await conn.sync({ force: false });
  console.log(`% listening at ${PORT}`);

}
);

const setTelegramWebhook = async () => {

  const ngrokURL = "https://cc1b-24-232-81-122.ngrok-free.app/";

  try {

    const webhookUrl = `${ngrokURL}/telegram/webhook`;
    bot.setWebHook(webhookUrl);
    console.log("Webhook configurado correctamente")
  } catch (error) {
    console.error("Error al configurar el webhook de Telegram:", error.message);
  }
};
//este webhook es para cuando se envie un mensaje al bot llegue al serivodr.
setTelegramWebhook();

