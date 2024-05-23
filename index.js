require("dotenv").config();
const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const bot = require("./src/telegramBot/telegramBot.js")

const PORT = process.env.PORT || 3000;


server.listen(PORT, async () => {
  await conn.sync({ force: false });
  console.log(`% listening at ${PORT}`);

}
);

const setTelegramWebhook = async () => {

  const url = "https://electrica-mosconi-backend-server.onrender.com/";

  try {

    const webhookUrl = `${url}/telegram/webhook`;
    bot.setWebHook(webhookUrl);
    console.log("Webhook configurado correctamente")
  } catch (error) {
    console.error("Error al configurar el webhook de Telegram:", error.message);
  }
};
//este webhook es para cuando se envie un mensaje al bot llegue al serivodr.
setTelegramWebhook();

