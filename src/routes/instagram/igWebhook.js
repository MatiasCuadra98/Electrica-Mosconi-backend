const { Router } = require('express');
const igWebhook = Router();

//webhook para recibir mensajes y procesarlos
igWebhook.post('/webhook/instagram', (req, res) => {
  console.log('Solicitud recibida en /webhook/instagram:', req.body);

  const body = req.body;
  
  if (body.object === 'instagram') {
    // Procesamos el mensaje directo de ig
    body.entry.forEach(entry => {
      const messageEvent = entry.messaging[0];
      // Log para ver si llega el mensaje, aca iria la logica para guardar el msj en la bd
      console.log("Mensaje recibido: ", messageEvent);
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

//Verificacion del token
 igWebhook.get('/webhook/instagram', (req, res) => {
   const VERIFY_TOKEN = 'emigverifytoken'; // token de verificacion, tiene que ser el mismo que coloquemos en meta
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

module.exports = igWebhook