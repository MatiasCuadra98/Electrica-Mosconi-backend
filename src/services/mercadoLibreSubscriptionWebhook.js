const axios = require("axios");

async function subscribeToMeliWebhook() {
  const accessToken = 'APP_USR-5980219025679562-092407-82b9690f26e3ff37065cded053f82a19-232533265'; // Usar el nuevo token
  const webhookUrl = 'https://electrica-mosconi-server.onrender.com/webhook/mercadolibre'; // URL del webhook en tu servidor
  const userId = '232533265'; // El User ID obtenido
  const appId = "5980219025679562"
  
  try {
    const response = await axios.post(
      `https://api.mercadolibre.com/users/${userId}/applications/${appId}/notifications`, // URL correcta para suscribirte
      {
        topic: ['questions', 'messages'], // Escuchando preguntas, puedes agregar otros eventos aquí
        callback_url: webhookUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("Suscripción a webhook de Mercado Libre exitosa:", response.data);
  } catch (error) {
    console.error("Error al suscribirse al webhook de Mercado Libre:", error.response?.data || error.message);
  }
}

module.exports = subscribeToMeliWebhook;
