const { Router } = require('express');
const axios = require('axios');
const { Business, User, MsgReceived, Contacts, SocialMedia } = require('../../db');
const { handleIncomingMessage } = require('../../telegramBot/telegramBot');

const messageWebhook = Router();

module.exports = (io) => {
    // Ruta para recibir mensajes
    messageWebhook.post('/messageWebHook', async (req, res) => {
        // Declaramos variables para recibir los mensajes en tiempo real con new Date y timestamp
        const { type, payload, timestamp, app } = req.body;
        console.log('payload', payload);

        const date = new Date(timestamp);
        const hours = date.getHours().toString();
        const minutes = date.getMinutes().toString();
        const seconds = date.getSeconds().toString();

        if (type === 'message') {
            const business = await Business.findOne({ where: { srcName: app } });
            console.log(business?.Contacts);

            if (business) {
                const users = await User.findAll({ where: { BusinessId: business.id } });
                if (users.length > 0) {
                    const [updatedCount, updatedRows] = await Contacts.update({ notification: true }, { where: { phone: payload.source } });
                    users.forEach((user) => {
                        io.to(user.socketId).emit('message', {
                            text: payload.payload.text,
                            from: payload.source,
                            name: payload.sender.name,
                            timestamp: `${hours}:${minutes}:${seconds}`,
                            sent: false,
                            key: payload.payload.id
                        });
                    });
                }

                // Función para generar un color aleatorio para el avatar del contacto
                function generarColorAleatorio() {
                    var r = Math.floor(Math.random() * 256);
                    var g = Math.floor(Math.random() * 256);
                    var b = Math.floor(Math.random() * 256);
                    var color = "rgb(" + r + "," + g + "," + b + ")";
                    return color;
                }

                const [newContact, created] = await Contacts.findOrCreate({
                    where: { phone: payload.source },
                    defaults: {
                        name: payload.sender.name,
                        notification: true,
                        chatId: payload.payload.id,
                        color: generarColorAleatorio()
                    }
                });
                await newContact.addBusiness(business);

                const newMsgReceived = await MsgReceived.create({
                    chatId: payload.payload.id,
                    text: payload.payload.text,
                    name: payload.sender.name,
                    fromData: payload.sender,
                    payload: payload,
                    timestamp: timestamp,
                    active: true,
                    state: 'No Leidos',
                    received: true
                });
                console.log('Llego un nuevo mensaje');

                // Asignar relaciones para MsgReceived
                await newMsgReceived.setBusiness(business);
                await newMsgReceived.setContact(newContact);

                const msgReceivedData = {
                    name: payload.sender.name,
                    chatId: payload.payload.id,
                    text: payload.payload.text,
                    fromData: payload.sender,
                    payload: payload,
                    timestamp: timestamp,
                    BusinessId: business.id,
                    Business: {
                        id: business.id,
                        name: business.name
                    },
                    active: false,
                    state: "No Leidos",
                    received: true,
                    ContactId: newContact.id,
                    Contact: {
                        id: newContact.id,
                        name: newContact.name,
                        phone: newContact.phone,
                        notification: newContact.notification
                    }
                };

                // Enviar los datos a la ruta específica
                await axios.post('http://localhost:3000/newMessageReceived', msgReceivedData);
                console.log("Datos del mensaje enviados a app desde Webhook");

                // Si el mensaje viene de Telegram, procesarlo usando la lógica de TelegramBot
                if (app === 'Telegram') {
                    await handleIncomingMessage(payload.payload);
                }
            }
        }

        res.status(200).end();
    });

    return messageWebhook;
};
