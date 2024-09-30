const axios = require('axios');
const querystring = require('querystring');
require("dotenv").config();

const mercadoLibreAuthController = {
    // Devuelve la URL de autenticación
    getAuthUrl: () => {
        const clientId = process.env.ML_CLIENT_ID;
        const redirectUri = process.env.ML_REDIRECT_URI;
        return `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    },

    // Intercambia el código de autorización por un token de acceso
    getAccessToken: async (authorizationCode) => {
        const clientId = process.env.ML_CLIENT_ID;
        const clientSecret = process.env.ML_CLIENT_SECRET;
        const redirectUri = process.env.ML_REDIRECT_URI;

        const response = await axios.post('https://api.mercadolibre.com/oauth/token', querystring.stringify({
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: authorizationCode,
            redirect_uri: redirectUri
        }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return response.data.access_token;
    }
};

module.exports = { mercadoLibreAuthController };
