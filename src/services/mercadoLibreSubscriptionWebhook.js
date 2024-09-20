// archivo: services/mercadolibreWebhook.js
const axios = require('axios');

async function subscribeToWebhook() {
    const APP_ID = '3149999715702183';
    const PAGE_ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN'; // me lo dan cuando me autentico
    const CALLBACK_URL = 'https://electrica-mosconi-server.onrender.com/webhook/mercadolibre';

    try {
        await axios.post(`https://api.mercadolibre.com/applications/${APP_ID}/webhooks`, {
            topic: 'questions',
            callback_url: CALLBACK_URL
        }, {
            headers: {
                'Authorization': `Bearer ${PAGE_ACCESS_TOKEN}`
            }
        });
        console.log('Suscripción a webhooks exitosa');
    } catch (error) {
        console.error('Error al suscribirse a los webhooks:', error.response.data);
    }
}

module.exports = subscribeToWebhook;
