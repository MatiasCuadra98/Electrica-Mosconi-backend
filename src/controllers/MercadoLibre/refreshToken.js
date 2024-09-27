// controllers/refreshToken.js
const axios = require('axios');

async function refreshToken(refreshToken) {
  const CLIENT_ID = '3652963349232358';
  const CLIENT_SECRET = 'UFZ5Nxl5zI83xdovdn8X3tUSdYK9h080';

  try {
    const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
      params: {
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error refrescando token:', error);
    throw error;
  }
}

module.exports = refreshToken;
