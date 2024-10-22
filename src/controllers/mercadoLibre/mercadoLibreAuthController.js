const axios = require('axios');
const querystring = require('querystring');
require("dotenv").config();
const { SocialMediaActive } = require("../../db");


const mercadoLibreAuthController = {
    getAuthUrl: () => {
        const clientId = process.env.ML_CLIENT_ID;
        const redirectUri = process.env.ML_REDIRECT_URI;
        return `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    },

    getAccessToken: async (authorizationCode) => {
        if (!authorizationCode) {
            throw new Error('El código de autorización es requerido.');
        }
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

            const { access_token, refresh_token, expires_in } = response.data;
            console.log('Tokens obtenidos:', response.data);
            return { accessToken: access_token, refreshToken: refresh_token, expires_in , authorizationCode };
        } catch (error) {
            console.error('Error al obtener el token de acceso:', error.response?.data || error.message);
            throw new Error('No se pudo obtener el token de acceso. Verifica el código de autorización y otros parámetros.');
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
    },
    checkAndRefreshToken: async () => {
        try {
            // Busca el token activo en la base de datos
            const socialMediaActive = await SocialMediaActive.findOne({
                where: { socialMediaId: 5, active: true },
            });

            if (socialMediaActive) {
                const { accessToken, refreshToken, expirationDate } = socialMediaActive;

                // Verifica si el token expirará en la próxima hora
                if (new Date(expirationDate).getTime() - Date.now() < 3600000) { // 1 hora
                    console.log('El token está por expirar. Renovando...');
                    const { accessToken: newAccessToken, newRefreshToken } = await mercadoLibreAuthController.refreshAccessToken(refreshToken);

                    // Actualiza la base de datos con el nuevo token y fecha de expiración
                    const newExpirationDate = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 horas de expiración
                    await socialMediaActive.update({
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                        expirationDate: newExpirationDate,
                    });

                    console.log('Token renovado y guardado en la base de datos.');
                    return { accessToken: newAccessToken };
                }

                // Si el token es válido, lo retorna
                return { accessToken };
            }
        } catch (error) {
            console.error('Error al verificar o renovar el token:', error);
            throw error;
        }
    }
};

module.exports = { mercadoLibreAuthController };
