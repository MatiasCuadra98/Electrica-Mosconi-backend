const { Router } = require('express');
const meliWebhook = Router();

// Ruta para recibir notificaciones de preguntas
meliWebhook.post('/webhook/mercadolibre', (req, res) => {
    const data = req.body;
    console.log('Pregunta recibida en producto:', data);

    // Aquí puedes almacenar la pregunta en tu base de datos o procesarla.
    
    res.status(200).send('OK');
});

module.exports = meliWebhook;