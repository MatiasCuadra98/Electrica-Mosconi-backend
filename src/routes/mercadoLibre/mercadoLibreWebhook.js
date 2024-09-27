const { Router } = require('express');
const meliWebhook = Router();

// Ruta para recibir notificaciones de preguntas
meliWebhook.post('/meliWebhook', (req, res) => {
// Mercado Libre envía los datos de la notificación en req.body
const notification = req.body;

console.log('Notificación recibida:', notification);

// Aquí puedes procesar la notificación y hacer algo con ella, por ejemplo, guardar en la base de datos
// notification.topic podría ser 'questions', 'messages', etc.

res.sendStatus(200); // Responde con 200 OK para que Mercado Libre sepa que lo recibiste correctament
});

module.exports = meliWebhook;