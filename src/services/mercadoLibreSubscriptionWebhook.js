const axios = require("axios");

async function subscribeToWebhook() {
  const ACCESS_TOKEN = "APP_USR-3149999715702183-092313-f86a0f86ea92c59fd4da5d3f92883663-232533265"; 
  const CALLBACK_URL = "https://electrica-mosconi-server.onrender.com/webhook/mercadolibre";
  const USER_ID = "232533265"; // ID del usuario autenticado

  try {
    // URL correcta para suscribirte a los webhooks
    const response = await axios.post(
      `https://api.mercadolibre.com/users/${USER_ID}/subscriptions`,
      {
        topic: "questions",  // Puedes agregar más topics si es necesario
        callback_url: CALLBACK_URL,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    console.log("Suscripción a webhook de Mercado Libre exitosa:", response.data);
  } catch (error) {
    console.error("Error al suscribirse al webhook de Mercado Libre:", error.response?.data || error.message);
  }
}

module.exports = subscribeToWebhook;
