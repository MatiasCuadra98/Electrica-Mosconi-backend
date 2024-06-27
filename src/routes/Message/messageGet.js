// routes/messageGet.js
const { Router } = require('express');
const { MsgReceived } = require('../../db');

const messageGet = Router();

// Ruta para obtener todos los mensajes
messageGet.get('/messages', async (req, res) => {
  try {
    const messages = await MsgReceived.findAll();
    res.json(messages);
    console.log("Mensajes obtenidos")
  } catch (error) {
    console.error('Error al obtener los mensajes:', error);
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

module.exports = messageGet;
