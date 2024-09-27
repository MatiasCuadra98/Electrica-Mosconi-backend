const {app,server } = require("./src/app.js");
const { syncDatabase } = require("./src/db.js");
const {bot} = require("./src/telegramBot/telegramBot.js")
const suscribirMeliWebhook = require("./src/services/mercadoLibreSubscriptionWebhook.js")
require("dotenv").config();

const PORT = process.env.PORT || 3000;
//const PORT = 3000; 


// Configura la autenticación y suscripción a Mercado Libre
const ACCESS_TOKEN = "APP_USR-3652963349232358-092715-d2716ee7b0f7384ba4762bf5180ef3f5-232533265" // Debes tener el access_token guardado
const USER_ID = "232533265"; // El user_id del usuario autenticado


app.listen(PORT, async () => {
//server.listen(PORT, async () => {
  try {
    await syncDatabase();  
    console.log(`% listening at ${PORT}`);

        // Suscripción a los webhooks de Mercado Libre
    if(ACCESS_TOKEN && USER_ID){
      console.log('Suscribiendo a los webhooks de Mercado Libre...');
      await suscribirMeliWebhook(ACCESS_TOKEN, USER_ID);
      console.log('Suscripción a Mercado Libre completada.');
    }else {
      console.warn('Faltan el access token o el user ID de Mercado Libre. No se puede realizar la suscripción.');
    }
  } catch (error) {
    console.error('Error synchronizing and backfilling database:', error);
  }
});

const setTelegramWebhook = async (url, retries = 5, delay = 3000) => {
  try {
    console.log("Configurando el webhook de telegram con URL:", url);
      const response = await bot.setWebHook(url);
      if(response) {
        console.log("Webhook de telegram configurado correctamente:", response);
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
  //hay que sacar la s de electricas, solo dejarla ahora pq no anda

  
  const URL = "https://electricaS-mosconi-server.onrender.com/messageWebHook";
setTelegramWebhook(URL);


