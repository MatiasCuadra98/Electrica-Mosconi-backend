// src/services/mercadoLibreSubscription.js
const axios = require('axios');
require('dotenv').config();

async function subscribeToWebhook(accessToken, userId) {
    const callbackUrl = 'https://electrica-mosconi-server.onrender.com/webhook/mercadolibre';

    try {
        const response = await axios.post(
            `https://api.mercadolibre.com/users/${userId}/subscriptions`,
            {
                topic: 'questions',
                callback_url: callbackUrl,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        console.log('Suscripción a webhook exitosa:', response.data);
    } catch (error) {
        console.error('Error al suscribirse al webhook:', error.response?.data || error.message);
    }
}

module.exports = subscribeToWebhook;
