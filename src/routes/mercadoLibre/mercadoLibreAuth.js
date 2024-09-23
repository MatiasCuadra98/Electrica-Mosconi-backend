const { Router } = require('express');
const meliAuth = Router();

const APP_ID = '8044043273351793';
const REDIRECT_URI = 'https://electrica-mosconi-server.onrender.com/callback';

meliAuth.get('/auth', (req, res) => {
    const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${APP_ID}&redirect_uri=${REDIRECT_URI}`;
    res.redirect(authUrl);
});

module.exports = meliAuth;
