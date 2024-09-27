// controllers/getMessages.js
const axios = require('axios');

async function getMessages(accessToken) {
  try {
    const response = await axios.get('https://api.mercadolibre.com/messages/packs', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    throw error;
  }
}

module.exports = getMessages;
