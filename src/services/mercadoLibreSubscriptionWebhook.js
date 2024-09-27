const axios = require('axios');

const CLIENT_ID = '3652963349232358';
const USER_ID = "232533265";
const ACCESS_TOKEN = "APP_USR-3652963349232358-092715-d2716ee7b0f7384ba4762bf5180ef3f5-232533265";
const REDIRECT_URI = 'https://electrica-mosconi-server.onrender.com/meliCallback'; // aca va la misma que usamos en mercadoLibreAuth.js 

// Función para suscribirse al webhook de Mercado Libre
async function suscribirMeliWebhook() {
    try {
        const response = await axios.post(
            `https://api.mercadolibre.com/applications/${CLIENT_ID}/subscriptions`,
            {
                user_id: USER_ID, // ID del usuario de Mercado Libre
                topic: 'questions',    // O 'messages', dependiendo del evento
                callback_url: REDIRECT_URI // URL de tu webhook
            },
            {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}` // Token de acceso de tu cliente
                }
            }
        );

        console.log('Suscripción exitosa:', response.data);
    } catch (error) {
        console.error('Error al suscribirse al webhook:', error);
    }
}

suscribirMeliWebhook();
