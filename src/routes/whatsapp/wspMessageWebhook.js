const { Router } = require('express');
const { handleMessage } = require('../../whatsappApi/whatsapp');
const wspMessageWebhook = Router();


wspMessageWebhook.get('/whatsappGet', (req, res) => {
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

wspMessageWebhook.post('/whatsapp/wspMessageWebhook', async (req, res) => {
  const { entry } = req.body;

  try {
    for (let change of entry[0].changes) {
      const message = change.value.messages[0];
      if (message) {
        console.log('Procesando mensaje de whatsapp:', message)
        await handleMessage(message);
      }
    }
    res.status(200).end();
  } catch (error) {
    console.error('Error procesando el mensaje de whatsapp:', error);
    res.status(500).json({ success: false, message: 'Error procesando el mensaje de whatsapp' });
  }
});


module.exports = wspMessageWebhook;
