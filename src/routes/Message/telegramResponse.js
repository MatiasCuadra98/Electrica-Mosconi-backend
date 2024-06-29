  const express = require('express');
  const router = express.Router();
  const {bot} = require('../../telegramBot/telegramBot')

  // Ruta para enviar respuestas a mensajes recibidos
  router.post('/send-response', (req, res) => {
    const { messageId, chatId, responseText } = req.body;

    // Enviar la respuesta al remitente del mensaje original en Telegram
    bot.sendMessage(chatId, responseText, { reply_to_message_id: messageId })
      .then(() => {
        res.status(200).send('Respuesta enviada correctamente');
      })
      .catch((error) => {
        console.error('Error al enviar la respuesta:', error);
        res.status(500).send('Error al enviar la respuesta');
      });
  });

  module.exports = router;
