const { Router } = require('express');
const { Business, User, MsgReceived, Contacts } = require('../../db');

const messageWebhook = Router();

module.exports = (io) => {
    // Ruta para recibir mensajes
    messageWebhook.post('/messageWebHook', async (req, res) => {
        // Declaramos variables para recibir los mensajes en tiempo real con new Date y timestamp
        const { message } = req.body;

        let type = '';
        let payload = {};
        let timestamp = null;

        if (message) {
            type = 'message'; // Asumimos que siempre es un mensaje si existe `message`
            payload = {
                source: message.chat.id,
                sender: {
                    name: message.from.first_name,
                },
                payload: {
                    text: message.text,
                    id: message.message_id,
                },
            };
            timestamp = message.date * 1000; // Telegram envía la fecha en segundos, la convertimos a milisegundos
        }

        console.log('payload:', payload);

        if (type === 'message') {
            const date = new Date(timestamp);
            const hours = date.getHours().toString();
            const minutes = date.getMinutes().toString();
            const seconds = date.getSeconds().toString();

            const business = await Business.findOne({ where: { srcName: 'telegram' } }); // Asegúrate de usar el nombre correcto de la app
            console.log('Business encontrado:', business);

            if (business) {
                const users = await User.findAll({ where: { BusinessId: business.id } });
                console.log('Usuarios encontrados:', users);
                if (users.length > 0) {
                    await Contacts.update({ notification: true }, { where: { phone: payload.source } });
                    users.forEach((user) => {
                        io.to(user.socketId).emit('message', {
                            text: payload.payload.text,
                            from: payload.source,
                            name: payload.sender.name,
                            timestamp: `${hours}:${minutes}:${seconds}`,
                            sent: false,
                            key: payload.payload.id,
                        });
                    });
                }

                // Función para generar un color aleatorio
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
                        color: generarColorAleatorio(),
                    },
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
                    received: true,
                });
                console.log('llego un nuevo mensaje');

                // Asignar relaciones para MsgReceived
                await newMsgReceived.setBusiness(business);
                await newMsgReceived.setContact(newContact);

                // Asignar relaciones para Contacts
                await newContact.setMsgReceived(newMsgReceived);
            } else {
                console.log('No se encontró ningún negocio con srcName: telegram');
            }
        } else {
            console.log('El mensaje no es del tipo esperado:', type);
        }

        res.status(200).end();
    });

    return messageWebhook;
};
