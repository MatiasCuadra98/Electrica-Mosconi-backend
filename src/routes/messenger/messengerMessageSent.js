const { Router } = require('express');
const sendMessageToUser = require('../../controllers/Facebook/sendMessengerMessage'); //importo la funcion de envio de msj
const sendMessengerMessage = Router();

// Ruta para enviar mensajes de respuesta
sendMessengerMessage.post('/messengerWebhook/messageSend', async (req, res) => {
  const { senderId, messageText } = req.body;

  if (!senderId || !messageText) {
    return res.status(400).json({ error: 'El senderId y el messageText son requeridos.' });
  }

  try {
    await sendMessageToUser(senderId, messageText);
    res.status(200).json({ success: 'Mensaje enviado correctamente.' });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje.' });
  }
});

module.exports = sendMessengerMessage;
