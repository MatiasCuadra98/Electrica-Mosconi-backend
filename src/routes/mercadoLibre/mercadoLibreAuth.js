const { Router } = require('express');
const meliAuth = Router();
require('dotenv').config();


const clientId = process.env.MELI_CLIENT_ID;
const redirectUri = process.env.MELI_REDIRECT_URI;

meliAuth.get('/auth', (req, res) => {
    const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    res.redirect(authUrl);
});

module.exports = meliAuth;
