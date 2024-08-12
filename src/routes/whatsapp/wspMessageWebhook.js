const { Router } = require('express');
const { handleMessage } = require('../../whatsappApi/whatsapp');
const wspMessageWebhook = Router();

wspMessageWebhook.all('/whatsapp', async (req, res) => {
  if (req.method === 'GET') {
    // Verificación del webhook
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
      res.status(200).send(challenge);
      console.log('Webhook verified successfully!');
    } else {
      res.sendStatus(403);
    }
  } else if (req.method === 'POST') {
    // Recepción de mensajes
    const { entry } = req.body;

    try {
      for (let change of entry[0].changes) {
        const message = change.value.messages[0];
        if (message) {
          console.log('Procesando mensaje de WhatsApp:', message);
          await handleMessage(message);
        }
      }
      res.status(200).end();
    } catch (error) {
      console.error('Error procesando el mensaje de WhatsApp:', error);
      res.status(500).json({ success: false, message: 'Error procesando el mensaje de WhatsApp' });
    }
  } else {
    res.sendStatus(405); // Método no permitido
  }
});

module.exports = wspMessageWebhook;
