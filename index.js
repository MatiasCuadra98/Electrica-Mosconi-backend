require("dotenv").config();
const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const { PORT } = process.env;
//const axios = require("axios");
const ngrok = require("ngrok");
const bot = require("./src/telegramBot/telegramBot.js")

server.listen(PORT, async () => {
  await conn.sync({ force: false });
  console.log(`% listening at ${PORT}`);

  ngrok
  .connect(PORT)
    .then((ngrokUrl) => {
      console.log(`ngrok tunnel in ${ngrokUrl}`);
    })
    .catch((error) => {
      console.log(`could not tunnel ngrok: ${error}`);
    });
  // Configurar el webhook de Telegram
});

const setTelegramWebhook = async () => {
  //const botToken = "7109913133:AAHFaShef4kAoR48jUUdkY5mifzZ6cSO_94"; // Reemplaza con el token de tu bot
  const ngrokURL = "https://cc1b-24-232-81-122.ngrok-free.app/";

  try {
    // const response = await axios.post(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    //   url: `${ngrokURL}/telegram/webhook`
    //  });
    //  console.log(response.data);
    const webhookUrl = `${ngrokURL}/telegram/webhook`;
    bot.setWebHook(webhookUrl);
    console.log("Webhook configurado correctamente")
  } catch (error) {
    console.error("Error al configurar el webhook de Telegram:", error.message);
  }
};
//este webhook es para cuando se envie un mensaje al bot llegue al serivodr.
setTelegramWebhook();

