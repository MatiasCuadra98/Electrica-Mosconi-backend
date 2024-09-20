const axios = require('axios');
const qs = require('qs');
const { Router } = require('express');
const meliCallback = Router();

const CLIENT_ID = '3149999715702183';
const CLIENT_SECRET = '85DbUoNinNbW7P9kctBpQIsdJ2dQeZmC';
const REDIRECT_URI = 'https://electrica-mosconi-server.onrender.com/callback';

meliCallback.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code;
    
    // Intercambiar el code por un access_token
    try {
        const response = await axios.post('https://api.mercadolibre.com/oauth/token', qs.stringify({
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: authorizationCode,
            redirect_uri: REDIRECT_URI
        }));

        const { access_token, refresh_token, expires_in } = response.data;
        // Almacenar el access_token y refresh_token en la base de datos
        res.send({ access_token, refresh_token, expires_in });
    } catch (error) {
        console.error('Error al obtener access token:', error.response.data);
        res.status(500).send('Error en la autenticación');
    }
});

module.exports = meliCallback;
