const { Router } = require('express');
const meliAuth = Router();


const client_id = "5980219025679562";
const redirect_uri = "https://electrica-mosconi-server.onrender.com/callback";

meliAuth.get('/auth', (req, res) => {
    const authUrl = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`;
    res.redirect(authUrl);
});

module.exports = meliAuth; 
