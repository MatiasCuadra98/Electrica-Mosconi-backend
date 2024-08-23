const { Router } = require('express');
const { Business, User, MsgReceived, Contacts } = require('../../db');

const messageWebhook = Router();

module.exports = (io) => {
    // Ruta para recibir mensajes
    messageWebhook.post('/messageWebHook', async (req, res) => {
        const { message } = req.body;

        // Verificar que se haya recibido el mensaje
        if (!message) {
            console.error('Error: No se recibió un mensaje');
            return res.status(400).send('Mensaje no recibido');
        }

        // Extraer información del mensaje
        const { from, chat, date, text } = message;
        const source = chat.id.toString();
        const sender = {
            name: from.first_name,
            id: from.id
        };
        const payload = {
            text: text,
            id: message.message_id
        };
        const timestamp = new Date(date * 1000).toISOString(); // Convertir la fecha al formato ISO

        // Log para depuración
        console.log('Cuerpo de la solicitud:', req.body);
        console.log('Tipo de mensaje:', 'message');
        console.log('Payload recibido:', payload);
        console.log('Timestamp:', timestamp);
        console.log('App:', 'electrica_mosconi'); // Reemplaza esto con la lógica real si es necesario

        // Lógica de procesamiento del mensaje
        const business = await Business.findOne({ where: { srcName: 'mosconi' } }); // Ajusta esto según sea necesario
        if (business) {
            const users = await User.findAll({ where: { BusinessId: business.id } });
            if (users.length > 0) {
                const [updatedCount, updatedRows] = await Contacts.update(
                    { notification: true },
                    { where: { phone: source } }
                );
                users.forEach((user) => {
                    io.to(user.socketId).emit('message', {
                        text: payload.text,
                        from: source,
                        name: sender.name,
                        timestamp: new Date(timestamp).toLocaleTimeString(),
                        sent: false,
                        key: payload.id
                    });
                });
            }

            // Función para generar color aleatorio
            function generarColorAleatorio() {
                var r = Math.floor(Math.random() * 256);
                var g = Math.floor(Math.random() * 256);
                var b = Math.floor(Math.random() * 256);
                var color = "rgb(" + r + "," + g + "," + b + ")";
                return color;
            }

            // Crear o encontrar el contacto
            const [newContact, created] = await Contacts.findOrCreate({
                where: { phone: source },
                defaults: {
                    name: sender.name,
                    notification: true,
                    chatId: payload.id,
                    color: generarColorAleatorio()
                }
            });
            await newContact.addBusiness(business);

            // Crear el mensaje recibido
            const newMsgReceived = await MsgReceived.create({
                chatId: payload.id,
                text: payload.text,
                name: sender.name,
                fromData: sender,
                payload: payload,
                timestamp: timestamp,
                active: true,
                state: 'No Leidos',
                received: true
            });

            console.log('Llegó un nuevo mensaje');
            await newMsgReceived.setBusiness(business);
            await newMsgReceived.setContact(newContact);
            await newContact.setMsgReceived(newMsgReceived);
        } else {
            console.error('Error: No se encontró el negocio con srcName:mosconi');
            return res.status(400).send('Negocio no encontrado');
        }

        res.status(200).end();
    });

    return messageWebhook;
};
