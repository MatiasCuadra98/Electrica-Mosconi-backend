const { Router } = require('express');
const { handleMessage } = require('../../whatsappApi/whatsapp');
const wspMessageWebhook = Router();

wspMessageWebhook.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verifica el token de verificación
  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log('Webhook verified successfully!');
  } else {
    res.sendStatus(403);
  }
});

wspMessageWebhook.post('/', async (req, res) => {
  const { entry } = req.body;

  try {
    if (entry && entry[0] && entry[0].changes && entry[0].changes[0] && entry[0].changes[0].value.messages) {
      const message = entry[0].changes[0].value.messages[0];
      if (message) {
        console.log('Procesando mensaje de whatsapp:', message);
        await handleMessage(message);
      } else {
        console.log('No se encontró mensaje en la estructura recibida.');
      }
    } else {
      console.log('Estructura de entrada no tiene el formato esperado:', JSON.stringify(req.body, null, 2));
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error procesando el mensaje de whatsapp:', error);
    res.status(500).json({ success: false, message: 'Error procesando el mensaje de whatsapp' });
  }
});

module.exports = wspMessageWebhook;
