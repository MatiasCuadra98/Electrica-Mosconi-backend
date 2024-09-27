const axios = require('axios');
const { Router } = require('express');
const meliCallback = Router();


const CLIENT_ID = '3652963349232358';
const CLIENT_SECRET = 'UFZ5Nxl5zI83xdovdn8X3tUSdYK9h080';
const REDIRECT_URI = 'https://electrica-mosconi-server.onrender.com/meliCallback'; // aca va la misma que usamos en mercadoLibreAuth.js 

meliCallback.get('/callback', async (req, res) => {
    const { code } = req.query;
  
    try {
      // aca hacemos una peticion a la api para obtener el CODE que se intercabia x el access token
      const response = await axios.post('https://api.mercadolibre.com/oauth/token', null, {
        params: {
          grant_type: 'authorization_code',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri: REDIRECT_URI,
        },
      });
  
      const { access_token, refresh_token, expires_in } = response.data;
  
      // aca hay q guardar los tokens en la bd(el refresh token hace que se actualice solo cuando expira)
      // mientras tanto lo guardo en la sesion
      req.session.access_token = access_token;
      req.session.refresh_token = refresh_token;
  
      res.send('Autenticación exitosa. Ahora puedes recibir preguntas y mensajes de meli.');
    } catch (error) {
      console.error('Error obteniendo el token de Mercado Libre:', error);
      res.status(500).send('Error autenticando con Mercado Libre');
    }
  });

module.exports = meliCallback;