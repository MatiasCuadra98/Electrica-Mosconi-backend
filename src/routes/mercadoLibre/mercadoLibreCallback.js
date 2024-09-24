const axios = require('axios');
const { Router } = require('express');
const meliCallback = Router();


const client_id = "5980219025679562";
const client_secret = "nVEFc9M0svU2EA8RLKQljb6UToROgIz8";
const redirect_uri = "https://electrica-mosconi-server.onrender.com/callback";

meliCallback.get('/callback', async (req, res) => {
    console.log('Callback recibido:', req.query);  // <-- Añadir este log

    const { code } = req.query;
    if (!code) {
        console.error('El parámetro "code" no fue recibido.');
        return res.status(400).send('Falta el parámetro "code"');
    }

    try {
        const response = await axios.post('https://api.mercadolibre.com/oauth/token', {
            grant_type: 'authorization_code',
            client_id: client_id,
            client_secret : client_secret,
            code: code,
            redirect_uri: redirect_uri,
        });

        const { access_token, refresh_token, user_id } = response.data;

        // Guarda el access_token, refresh_token, y user_id en tu base de datos o una sesión.
        console.log('Access Token:', access_token);
        console.log('User ID:', user_id);
        console.log('refresh token:', refresh_token)

        res.send('Autenticación exitosa');
    } catch (error) {
        console.error('Error al obtener el access token:', error.response.data);
        res.status(500).send('Error en la autenticación');
    }
});

module.exports = meliCallback;