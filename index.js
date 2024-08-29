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

const setTelegramWebhook = async (url, retries = 5, delay = 3000) => {
  try {
    console.log("Configurando el webhook con URL:", url);
      const response = await bot.setWebHook(url);
      if(response) {
        console.log("Webhook configurado correctamente:", response);
      } else {
        console.error("Error al configurar el webhook:", error.message);
        console.log("reintentado configuracion");
        if (retries > 0) {
          console.log(`Reintentando configuración en ${delay / 1000} segundos... (Intentos restantes: ${retries})`);
          setTimeout(() => {
            setTelegramWebhook(url, retries - 1, delay); // Reintenta después del timeout
          }, delay);
        } else {
          console.error("Se han agotado los intentos de configuración del webhook.");
        }
      }
    } catch (error) {
      console.error("Error al configurar el webhook de Telegram:", error.message);
    }
  };
  
  const URL = "https://electrica-mosconi-server.onrender.com/telegram/messageWebHook";
setTelegramWebhook(URL);


