const { Router } = require('express');
const messengerWebhook = Router();


//esta ruta es para setear el webhook en meta
messengerWebhook.get('/messengerWebhook', (req, res) => {
    const VERIFY_TOKEN = 'messengerWebhookToken'; //este token tiene que ser igual al colocamos en meta
  
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
  
    if (mode && token) {
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook de Messenger OK'); //log para ver si se verifico correctamente el webhook
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  });
  
  module.exports = messengerWebhook