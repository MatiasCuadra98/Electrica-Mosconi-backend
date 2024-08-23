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
//"url=https://electrica-mosconi-server.onrender.com/messageWebHook/" "https://api.telegram.org/bot7109913133:AAHFaShef4kAoR48jUUdkY5mifzZ6cSO_94/setWebhook"
//curl -X GET "https://api.telegram.org/bot7109913133:AAHFaShef4kAoR48jUUdkY5mifzZ6cSO_94/getWebhookInfo"

const setTelegramWebhook = async () => {

  const url = "https://electrica-mosconi-server.onrender.com/messageWebHook/";
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

