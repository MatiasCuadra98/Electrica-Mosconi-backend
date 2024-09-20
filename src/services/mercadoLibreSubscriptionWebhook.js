const axios = require("axios");

async function subscribeToWebhook() {
  const APP_ID = "3149999715702183"; //id de meli
  const ACCESS_TOKEN =
    "APP_USR-3149999715702183-092016-7c6043e53856c25b46984ac65c38f5bf-232533265"; // cuando te autenticas te dan el token
  const CALLBACK_URL =
    "https://electrica-mosconi-server.onrender.com/webhook/mercadolibre"; // esta seria la url donde recibimos notificaciones

  try {
    // URL para suscribirme a los webhooks en Mercado Libre
    const response = await axios.post(
      `https://api.mercadolibre.com/applications/${APP_ID}/notifications`,
      {
        user_id: "232533265", // este te lo dan despues que te autenticas
        topics: ["questions"], // Aquí puedes agregar más "topics" si necesitas más eventos
        callback_url: CALLBACK_URL,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    console.log("Suscripción a webhook de meli exitosa:", response.data);
  } catch (error) {
    console.error(
      "Error al suscribirse al webhook de meli:",
      error.response?.data || error.message
    );
  }
}

module.exports = subscribeToWebhook;
