const { Router } = require('express');
const igWebhook = Router();
const crypto = require('crypto');

//  clave secreta de app de Meta
const appSecret = process.env.APP_SECRET || 'c9055ea3d6f4d713da39caeb76cb6929';

// Middleware para validar la firma de la solicitud
igWebhook.post('/webhook/instagram', (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);

  // Calcula la firma esperada usando la clave secreta
  const expectedSignature = `sha256=${crypto.createHmac('sha256', appSecret).update(payload).digest('hex')}`;

  if (signature !== expectedSignature) {
    console.error("Firma no válida");
    return res.sendStatus(403); 
  }

  console.log('Solicitud recibida en /webhook/instagram:', req.body);

  const body = req.body;
  
  if (body.object === 'instagram') {
    // Procesamos el mensaje directo de IG
    body.entry.forEach(entry => {
      const messageEvent = entry.messaging[0];
      // Log para ver si llega el mensaje, aquí iría la lógica para guardar el mensaje en la BD
      console.log("Mensaje recibido: ", messageEvent);
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Verificación del token
igWebhook.get('/webhook/instagram', (req, res) => {
  const VERIFY_TOKEN = 'emigverifytoken'; // Token de verificación, tiene que ser el mismo que coloquemos en Meta
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verificado.');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

module.exports = igWebhook;
