// const { Router } = require("express");

// const enviarRespuestaManual  = require('../../telegramBot/telegramBot'); // Ajusta la ruta según tu estructura de archivos
// const manualResponse = Router();


// // Ruta para enviar respuesta manual
// manualResponse.post('/api/enviarRespuestaManual', async (req, res) => {
//   const { chatId, mensaje } = req.body;

//   try {
//     const resultado = await enviarRespuestaManual(chatId, mensaje);
//     res.json({ success: true, message: resultado.message });
//   } catch (error) {
//     console.error('Error al enviar respuesta manual desde el backend:', error);
//     res.status(500).json({ success: false, message: 'Error al enviar respuesta manual' });
//   }
// });

// // module.exports = router;
// module.exports = manualResponse;