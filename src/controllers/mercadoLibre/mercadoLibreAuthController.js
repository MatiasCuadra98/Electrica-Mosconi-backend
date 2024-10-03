const axios = require('axios');
const querystring = require('querystring');
require("dotenv").config();

const mercadoLibreAuthController = {
    getAuthUrl: () => {
        const clientId = process.env.ML_CLIENT_ID;
        const redirectUri = process.env.ML_REDIRECT_URI;
        return `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    },

    getAccessToken: async (authorizationCode) => {
        const clientId = process.env.ML_CLIENT_ID;
        const clientSecret = process.env.ML_CLIENT_SECRET;
        const redirectUri = process.env.ML_REDIRECT_URI;

        try {
            console.log('Intercambiando código por token de acceso...');
            const response = await axios.post('https://api.mercadolibre.com/oauth/token', querystring.stringify({
                grant_type: 'authorization_code',
                client_id: clientId,
                client_secret: clientSecret,
                code: authorizationCode,
                redirect_uri: redirectUri
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token, refresh_token } = response.data;
            console.log('Tokens obtenidos:', response.data);
            return { accessToken: access_token, refreshToken: refresh_token, authorizationCode };
        } catch (error) {
            console.error('Error al obtener el token de acceso:', error.message);
            throw error;
        }
    },

    refreshAccessToken: async (refreshToken) => {
        const clientId = process.env.ML_CLIENT_ID;
        const clientSecret = process.env.ML_CLIENT_SECRET;

        try {
            console.log('Renovando token de acceso...');
            const response = await axios.post('https://api.mercadolibre.com/oauth/token', querystring.stringify({
                grant_type: 'refresh_token',
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken
            }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            const { access_token, refresh_token: newRefreshToken } = response.data;
            console.log('Nuevo token de acceso obtenido:', response.data);
            return { accessToken: access_token, newRefreshToken };
        } catch (error) {
            console.error('Error al renovar el token de acceso:', error.message);
            throw error;
        }
    }
};

module.exports = { mercadoLibreAuthController };
