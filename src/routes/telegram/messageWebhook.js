const { Router } = require('express')
const {Business,User,MsgReceived, Contacts, SocialMedia} = require('../../db')

 const messageWebhook = Router()

module.exports = (io)=>{
    //ruta para recibir mensajes
    messageWebhook.post('/messageWebHook', async (req, res) =>{
        //declaramos variables para recibir los mensajes en tiempo real con new Date y timestamp
        const { type, payload, timestamp, app } = req.body;
        const socialMediaId = 1; //id de telegram
        console.log('payload', payload);
        const date = new Date(timestamp)
        const hours = date.getHours().toString()
        const minutes = date.getMinutes().toString()
        const seconds = date.getSeconds().toString()
        if (type === 'message') {    
            const business = await Business.findOne({where: {srcName: app}})
            console.log(business.Contacts);
            
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
                // //cuando se genere un nuevo contacto, se le dara un color aleatorio al avatar
                // function generarColorAleatorio() {
                //     var r = Math.floor(Math.random() * 256); 
                //     var g = Math.floor(Math.random() * 256); 
                //     var b = Math.floor(Math.random() * 256); 
                //     var color = "rgb(" + r + "," + g + "," + b + ")"; 
                //     return color;
                // }
                
                const [newContact, created] = await Contacts.findOrCreate({
                    where:{ numberPhoneId:payload.source}, 
                    defaults:{
                        name:payload.sender.name, 
                        notification:true, 
                        chatId:payload.payload.id,
                        phoneNumber: payload.source
                    }})
                    
                await newContact.addBusiness(business);
                if (created && socialMediaId) {
                    const socialMedia = await SocialMedia.findByPk(socialMediaId);
                    if (!socialMedia)
                      throw new Error(
                        `contact-socialMedia: Social Media with id ${socialMediaId} not found`
                      );
                    await newContact.setSocialMedia(socialMedia);
                  }

                const newMsgReceived = await MsgReceived.create({
                    chatId: payload.payload.id,
                    text: payload.payload.text,
                    name: payload.sender.name,
                    numberPhoneId: payload.sender.id,
                    timestamp: Date.now(),
                    //timestamp: timestamp,
                    phoneNumber: payload.payload.id,
                    BusinessId: business.id,
                    // active: true,
                    // state: 'No Leidos',
                    // received: true
                });
                console.log('llego un nuevo mensaje');
                // Asignar relaciones para MsgReceived
                await newMsgReceived.setBusiness(business);
                await newMsgReceived.setContact(newContact);
                if (socialMediaId) {
                    const socialMedia = await SocialMedia.findByPk(socialMediaId);
                    if (!socialMedia)
                      throw new Error(
                        `msgReceived-socialMedia: Social Media with id ${socialMediaId} not found`
                      );
                    await newMsgReceived.setSocialMedium(socialMedia);
                  }
                // Asignar relaciones para Contacts
                await newContact.setMsgReceived(newMsgReceived);

                const msgReceivedData = {
                    chatId: payload.payload.id,
                    text: payload.payload.text,
                    name: payload.sender.name,
                    numberPhoneId: payload.sender.id,
                    timestamp: Date.now(),
                    //timestamp: timestamp,
                    phoneNumber: payload.payload.id,
                    BusinessId: business.id,
                    Business: {
                      id: business.id,
                      name: business.name
                    },
                    ContactId: newContact.id,
                    Contact: {
                        id: newContact.id,
                        name: newContact.name,
                        phoneNumber: newContact.phoneNumber,
                    },
                    active: false,
                    state: "No Leidos",
                    received: true,
                  };
          
                  // Enviar los datos a la ruta específica
                  await axios.post('http://localhost:3000/newMessageReceived', msgReceivedData);
                  console.log("Datos del mensaje enviados a app desde Webhook");
            }
        }
        
        res.status(200).end()
    })

    return messageWebhook;
}