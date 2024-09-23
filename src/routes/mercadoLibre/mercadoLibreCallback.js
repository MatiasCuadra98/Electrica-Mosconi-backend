const axios = require('axios');
const { Router } = require('express');
const meliCallback = Router();
require('dotenv').config();


const clientId = process.env.MELI_CLIENT_ID;
const clientSecret = process.env.MELI_CLIENT_SECRET;
const redirectUri = process.env.MELI_REDIRECT_URI;

meliCallback.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const response = await axios.post('https://api.mercadolibre.com/oauth/token', {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
        });

        const { access_token, refresh_token, user_id } = response.data;

        // Guarda el access_token, refresh_token, y user_id en tu base de datos o una sesión.
        console.log('Access Token:', access_token);
        console.log('User ID:', user_id);

        res.send('Autenticación exitosa');
    } catch (error) {
        console.error('Error al obtener el access token:', error.response.data);
        res.status(500).send('Error en la autenticación');
    }
});

module.exports = meliCallback;