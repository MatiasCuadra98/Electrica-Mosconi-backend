const axios = require('axios');
require('dotenv').config();
// Función para enviar un mensaje al usuario que nos envio un mensaje desde facebook messenger
async function sendMessageToUser(senderId, messageText) {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN; //este token se saca de meta developers en el dashboard de la app

  const messageData = {
    recipient: {
      id: senderId,
    },
    message: {
      text: messageText,
    },
  };

  await axios.post(`https://graph.facebook.com/v15.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, messageData)
    .then(response => {
      console.log('Mensaje enviado correctamente:', response.data);
    })
    .catch(error => {
      console.error('Error al enviar el mensaje:', error.response ? error.response.data : error.message);
    });
}

module.exports = sendMessageToUser;
