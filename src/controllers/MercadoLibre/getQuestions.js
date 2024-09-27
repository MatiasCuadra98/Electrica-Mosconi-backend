// controllers/getQuestions.js
const axios = require('axios');

async function getQuestions(accessToken) {
  try {
    const response = await axios.get('https://api.mercadolibre.com/my/received_questions/search', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error obteniendo preguntas:', error);
    throw error;
  }
}

module.exports = getQuestions;
