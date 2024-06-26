const { Router } = require('express')
const {Business,User,MsgReceived, Contacts, SocialMedia} = require('../../db')

 const messageWebhook = Router()

module.exports = (io)=>{
    //ruta para recibir mensajes
    messageWebhook.post('/messageWebHook/', async (req, res) =>{
        //declaramos variables para recibir los mensajes en tiempo real con new Date y timestamp
        const { type, payload, timestamp, app } = req.body;
        const date = new Date(timestamp)
        const hours = date.getHours().toString()
        const minutes = date.getMinutes().toString()
        const seconds = date.getSeconds().toString()
        if (type === 'message') {    
            const business = await Business.findOne({where: {srcName: app}})
            // const socialMedia = await SocialMedia.findOne({where: {name: payload.source}}) a chequear desde donde puedo sacar el dato de la red social
            //ver en las proximas lineas de codigo para que sirven? ya que se trae al modelo User => y este modelo es de los empleados... 
            if (business) {
                const users = await User.findAll({where:{BusinessId:business.id}})
                if (users.length > 0) {
                    const [updatedCount, updatedRows] = await Contacts.update({notification: true}, {where: {phone: payload.source}})
                    users.forEach((user)=>{
                        io.to(user.socketId).emit('message', {
                                text:payload.payload.text,
                                from: payload.source,
                                name:payload.sender.name,
                                timestamp: `${hours}:${minutes}:${seconds}`,
                                sent:false,
                                key:payload.payload.id
                            });
                    })
                }
                //cuando se genere un nuevo contacto, se le dara un color aleatorio al avatar
                function generarColorAleatorio() {
                    var r = Math.floor(Math.random() * 256); 
                    var g = Math.floor(Math.random() * 256); 
                    var b = Math.floor(Math.random() * 256); 
                    var color = "rgb(" + r + "," + g + "," + b + ")"; 
                    return color;
                }
                
                const [newContact, created] = await Contacts.findOrCreate({where:{phone:payload.source, BusinessId:business.id}, defaults:{name:payload.sender.name, notification:true, color:generarColorAleatorio()}})
                await newContact.addBusiness(business);
                // await newContact.setSocialMedia(socialMedia) 

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
                // Asignar relaciones para MsgReceived
                await newMsgReceived.setBusiness(business);
                await newMsgReceived.setContact(newContact);
                // await newMsgReceived.setSocialMedia(socialMedia)
                // Asignar relaciones para Contacts
                await newContact.setMsgReceived(newMsgReceived);
                
            }
        }
        
        res.status(200).end()
    })

    return messageWebhook;
}