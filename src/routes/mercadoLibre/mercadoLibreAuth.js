const { Router } = require('express');
const meliAuth = Router();
require('dotenv').config();


const appId = "5980219025679562";
const redirectUri = "https://electrica-mosconi-server.onrender.com/callback";

meliAuth.get('/auth', (req, res) => {
    const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${appId}&redirect_uri=${redirectUri}`;
    res.redirect(authUrl);
});

module.exports = meliAuth; 
