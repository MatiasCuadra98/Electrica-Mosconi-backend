const axios = require("axios");
require('dotenv').config();

async function subscribeToMeliWebhook() {
  const ACCESS_TOKEN = 'APP_USR-5980219025679562-092318-cd2251e9bdd85ffcae52c42fad2948f3-232533265'; // Usar el nuevo token
  const CALLBACK_URL = 'https://electrica-mosconi-server.onrender.com/webhook/mercadolibre'; // URL del webhook en tu servidor
  const USER_ID = '232533265'; // El User ID obtenido
  const MELI_CLIENT_ID = "5980219025679562"
  
  try {
    const response = await axios.post(
      `https://api.mercadolibre.com/users/${USER_ID}/applications/${MELI_CLIENT_ID}/notifications`, // URL correcta para suscribirte
      {
        topic: 'questions', // Escuchando preguntas, puedes agregar otros eventos aquí
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

module.exports = subscribeToMeliWebhook;
