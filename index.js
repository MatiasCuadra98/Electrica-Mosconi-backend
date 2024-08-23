const {app,server } = require("./src/app.js");
const { syncDatabase } = require("./src/db.js");
const {bot} = require("./src/telegramBot/telegramBot.js")
require("dotenv").config();

const PORT = process.env.PORT || 3000;
//const PORT = 3000; 

app.listen(PORT, async () => {
//server.listen(PORT, async () => {
  try {
    await syncDatabase();  
    console.log(`% listening at ${PORT}`);
  } catch (error) {
    console.error('Error synchronizing and backfilling database:', error);
  }
});

const setTelegramWebhook = async () => {

  const url = "https://electrica-mosconi-server.onrender.com/messageWebHook";
  try {

    console.log("Configurando el webhook con URL:", webhookUrl);

    await bot.setWebHook(url);
    console.log("Webhook configurado correctamente")
  } catch (error) {
    console.error("Error al configurar el webhook de Telegram:", error.message);
  }
};


//este webhook es para cuando se envie un mensaje al bot llegue al serivodr.
setTelegramWebhook();

