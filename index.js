require("dotenv").config();
const server = require("./src/app.js");
const { syncDatabase } = require("./src/db.js");
const {bot} = require("./src/telegramBot/telegramBot.js")

const PORT = process.env.PORT || 3000;


server.listen(PORT, async () => {
  try {
    await syncDatabase();  // Usar la función de sincronización personalizada
    console.log(`% listening at ${PORT}`);
  } catch (error) {
    console.error('Error synchronizing and backfilling database:', error);
  }
});

const setTelegramWebhook = async () => {

  const url = "https://electrica-mosconi-server.onrender.com";
  try {

    const webhookUrl = `${url}/bot${bot.token}`;
    await bot.setWebHook(webhookUrl);
    console.log("Webhook configurado correctamente")
  } catch (error) {
    console.error("Error al configurar el webhook de Telegram:", error.message);
  }
};


//este webhook es para cuando se envie un mensaje al bot llegue al serivodr.
setTelegramWebhook();

