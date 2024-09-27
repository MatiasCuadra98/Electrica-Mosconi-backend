const { Router } = require('express');
const meliAuth = Router();

//app id
const CLIENT_ID = '3652963349232358';
//ruta post auth
const REDIRECT_URI = 'https://electrica-mosconi-server.onrender.com/meliCallback'; // aca va la misma que usamos en mercadoLibreAuth.js 
//url de meli para la auth. Si pasamos la auth, la url nos da un code para obtener el access token
const ML_AUTH_URL = `https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

meliAuth.get('/auth', (req, res) => {
    res.redirect(ML_AUTH_URL);
});

module.exports = meliAuth; 
