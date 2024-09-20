const { Router } = require('express');
const meliWebhook = Router();

// Ruta para recibir notificaciones de MercadoLibre
meliWebhook.post('/webhook/mercadolibre', (req, res) => {
    const data = req.body;
    console.log('Notificación recibida:', data);
    // Procesa el evento (puede ser una pregunta o un mensaje)

    // Confirma la recepción de la notificación
    res.status(200).send('OK');
});

module.exports = meliWebhook;
