const { Router } = require("express");
const { sendMessage } = require('../../whatsappApi/whatsapp');
const wspManualResponse = Router();

wspManualResponse.post('/whatsapp/enviarRespuestaManualWsp', async (req, res) => {
  const { chatId, message } = req.body;
  try {
    await sendMessage(chatId, message);
    res.json({ success: true, message: "Respuesta enviada correctamente" });
  } catch (error) {
    console.error('Error al enviar respuesta manual desde el backend:', error);
    res.status(500).json({ success: false, message: 'Error al enviar respuesta manual' });
  }
});

module.exports = wspManualResponse;
