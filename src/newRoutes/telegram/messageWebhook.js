// const { Router } = require('express')
// const {Business,User,MsgReceived, Contacts} = require('../../db')

// const messageWebhook = Router()


// module.exports = (io)=>{
//     //ruta para recibir mensajes
//     messageWebhook.post('/messageWebHook/', async (req, res) =>{
//         //declaramos variables para recibir los mensajes en tiempo real con new Date y timestamp
//         const {type, payload, timestamp,app} = req.body
//         const date = new Date(timestamp)
//         const hours = date.getHours().toString()
//         const minutes = date.getMinutes().toString()
//         const seconds = date.getSeconds().toString()
//         if (type === 'message') {    
//             const business = await Business.findOne({where: {srcName: app}})
//             if (business) {
//                 const users = await User.findAll({where:{BusinessId:business.id}})
//                 if (users.length > 0) {
//                     const [updatedCount, updatedRows] = await Contacts.update({notification: true}, {where: {phone: payload.source}})
//                     users.forEach((user)=>{
//                         io.to(user.socketId).emit('message', {
//                                 text:payload.payload.text,
//                                 from: payload.source,
//                                 name:payload.sender.name,
//                                 timestamp: `${hours}:${minutes}:${seconds}`,
//                                 sent:false,
//                                 key:payload.payload.id
//                             });
//                     })
//                 }
//                 //cuando se genere un nuevo contacto, se le dara un color aleatorio al avatar
//                 function generarColorAleatorio() {
//                     var r = Math.floor(Math.random() * 256); 
//                     var g = Math.floor(Math.random() * 256); 
//                     var b = Math.floor(Math.random() * 256); 
                  
//                     var color = "rgb(" + r + "," + g + "," + b + ")";
                  
//                     return color;
//                 }
//                 const [newContact, created] = await Contacts.findOrCreate({where:{phone:payload.source, BusinessId:business.id}, defaults:{name:payload.sender.name, notification:true, color:generarColorAleatorio()}})
//                 await MsgReceived.create({name: payload.sender.name, phone:payload.source, payload: payload,timestamp:timestamp, BusinessId: business.id, ContactId: newContact.id})
//             }
//         }
        
//         res.status(200).end()
//     })

//     return messageWebhook;
// }