const { Router } = require('express');
const { handleMessage } = require('../../whatsappApi/whatsapp');
const wspMessageWebhook = Router();
require("dotenv").config();

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
  //const body = JSON.stringify(req.body, null, 2)
  //console.log('WEBHOOK - Contenido completo de req.body:', body)
  // console.log('entry: ', entry);
  // if (entry && entry[0]) { 
  //   console.log('changes: ', entry[0].changes);
  // }
  try {
    if (entry && entry[0] && entry[0].changes && entry[0].changes[0]) {
      const change = entry[0].changes[0];
      console.log('WEBHOOK - change1: ', change);
      
      if (change.field === 'messages') {
        const value = change.value;
        if (value.messages && value.messages[0]) {
          const message = value.messages[0];
          console.log('WEBHOOK - Procesando mensaje de WhatsApp:', message);
          await handleMessage(change);
        }}
        //} else if (value.statuses) {
          //console.log('WEBHOOK - Estado del mensaje de WhatsApp recibido:', value.statuses[0]);
          // Aquí puedes manejar el estado del mensaje, si es necesario.
    //     } else {
    //       console.log('WEBHOOK - No se encontró un mensaje o estado en la estructura recibida.');
    //     }
    //   } else {
    //     console.log('WEBHOOK - Campo no reconocido en la estructura recibida:', change.field);
    //   }
    // } else {
    //   console.log('WEBHOOK - Estructura de entrada no tiene el formato esperado:', JSON.stringify(req.body, null, 2));
     }
    res.status(200).end();
  } catch (error) {
    console.error('WEBHOOK - Error procesando el mensaje de WhatsApp:', error);
    res.status(500).json({ success: false, message: 'WEBHOOK - Error procesando el mensaje de WhatsApp' });
  }
});

module.exports = wspMessageWebhook;
