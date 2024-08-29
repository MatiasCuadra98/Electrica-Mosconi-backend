const { Router } = require('express')
const {Business,User,MsgReceived, Contacts, SocialMedia} = require('../../db')

 const messageWebhook = Router()

module.exports = (io)=>{
    //ruta para recibir mensajes
    messageWebhook.post('/telegram/messageWebHook', async (req, res) =>{
      console.log('mensaje recibido:', req.body);
      const businessId = "5e31d0fb-87b5-4ccf-b150-e730872c7a0e"; 
      const socialMediaId = 1; //id de telegram
      const {msg} = req.body
      if (!msg) {
        console.error('No se recibió un msg en el body');
        return res.status(400).send('Bad Request: No msg in body');
      }

      const chatId = msg;
      const message = msg;
      const senderName = msg;
      const senderIdUser = msg;

      // const date = new Date(timestamp)
      // const hours = date.getHours().toString()
      // const minutes = date.getMinutes().toString()
      // const seconds = date.getSeconds().toString()
      try {
        const business = await Business.findByPk(businessId)
        if (!business) {
          return res.status(404).send('Business no encontrado');
        };
        const socialMedia = await SocialMedia.findByPk(socialMediaId);
        if (!socialMedia) {
          return res.status(404).send('Social Media no encontrado');
        }
      //   if(business) {
      //     const users = await User.findAll({where: {BusinessId: businessId}})
      //     if(users.length) {
      //       users.forEach((user) => {
      //         io.to(user.socketId).emit('message', {
      //           text:message,
      //           from: senderIdUser,
      //           name:senderName,
      //           timestamp: Date.now(),
      //           //timestamp: `${hours}:${minutes}:${seconds}`,
      //           sent:false,
      //           key:chatId
      //         });
      //       }) 
      //     }
      // };
      const [newContact, created] = await Contacts.findOrCreate({
        where: {idUser: senderIdUser },
        defaults: {
          name: senderName,
          notification: true,
          chatId: chatId,
          phone: senderIdUser
        }
        });
    // Asociar el contacto con el negocio
    if (created && business) {
      const business = await Business.findByPk(businessId);
      if (!business)
        throw new Error(
          `contact-business: Business with id ${businessId} not found`
        );
      await newContact.addBusiness(business);
    }

    // Asociar el contacto con la red social
    if (created && socialMedia) {
      const socialMedia = await SocialMedia.findByPk(socialMediaId);
      if (!socialMedia)
        throw new Error(
          `contact-socialMedia: Social Media with id ${socialMediaId} not found`
        );
      await newContact.setSocialMedia(socialMedia);
    }
        
        const contact = await Contacts.findOne({ where: { phone: senderIdUser } });
        if (!contact) throw new Error(`Contact not found`);

         // Crear el mensaje recibido
    const msgReceived = await MsgReceived.create({
      chatId: chatId,
      idUser: msg.from.id,
      text: message,
      name: senderName,
      timestamp: Date.now(),
      phoneNumber: chatId,
      BusinessId: businessId,
      active: false,
      state: "No Leidos",
      received: true,
    });
  // Asociar el mensaje recibido con el negocio
  if (business) {
    const business = await Business.findByPk(businessId);
    if (!business)
      throw new Error(
        `msgReceived-business: Business with id ${businessId} not found`
      );
    await msgReceived.setBusiness(business);
  }

  // Asociar el mensaje recibido con el contacto
  await msgReceived.setContact(contact);

  // Asociar el mensaje recibido con la red social
  if (socialMedia) {
    const socialMedia = await SocialMedia.findByPk(socialMediaId);
    if (!socialMedia)
      throw new Error(
        `msgReceived-socialMedia: Social Media with id ${socialMediaId} not found`
      );
    await msgReceived.setSocialMedium(socialMedia);
  }
    
    console.log("Mensaje recibido y guardado en la base de datos desde WEBHOOK:", msgReceived);
    const msgReceivedData = {
      id: msgReceived.id,
      chatId: msgReceived.chatId,
      idUser: msgReceived.idUser,
      text: msgReceived.text,
      name: msgReceived.name,
      timestamp: msgReceived.timestamp,
      phoneNumber: msgReceived.phoneNumber,
      BusinessId: businessId,
      Business: {
        id: Business.id,
        name: Business.name
      },
      active: false,
      state: "No Leidos",
      received: true,
      ContactId: contact.id,
      Contact: {
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
      },
      SocialMediumId: socialMediaId,
      SocialMedium: {
        id: socialMediaId,
        name: SocialMedia.name,
        icon: SocialMedia.icon
      }
    };
    console.log('mensaje enviado a app', msgReceivedData);

    try {
      //await axios.post('http://localhost:3000/newMessageReceived', msgReceivedData);
      await axios.post('https://electrica-mosconi-server.onrender.com/newMessageReceived', msgReceivedData);
      console.log("Datos del mensaje enviados a app desde Webhook");
    } catch (error) {
      console.error("Error al enviar datos del mensaje a la app desde Webhook:", error.message);
    }

    res.status(200).end();
  } catch (error) {
    console.error('Error al procesar el mensaje en webhook:', error);
    res.status(500).send('Error interno del servidor');
  }
});

return messageWebhook;
}
 
      //declaramos variables para recibir los mensajes en tiempo real con new Date y timestamp
      //const { type, payload, timestamp, app } = req.body;
        // if (type === 'message') {    
        //     const business = await Business.findOne({where: {srcName: app}})
        //     console.log(business.Contacts);
            
        //     if (business) {
        //         const users = await User.findAll({where:{BusinessId:business.id}})
        //         if (users.length > 0) {
        //             const [updatedCount, updatedRows] = await Contacts.update({notification: true}, {where: {phone: payload.source}})
        //             users.forEach((user)=>{
        //                 io.to(user.socketId).emit('message', {
        //                         text:payload.payload.text,
        //                         from: payload.source,
        //                         name:payload.sender.name,
        //                         timestamp: `${hours}:${minutes}:${seconds}`,
        //                         sent:false,
        //                         key:payload.payload.id
        //                     });
        //             })
        //         }
        //         // //cuando se genere un nuevo contacto, se le dara un color aleatorio al avatar
        //         // function generarColorAleatorio() {
        //         //     var r = Math.floor(Math.random() * 256); 
        //         //     var g = Math.floor(Math.random() * 256); 
        //         //     var b = Math.floor(Math.random() * 256); 
        //         //     var color = "rgb(" + r + "," + g + "," + b + ")"; 
        //         //     return color;
        //         // }
                
        //         const [newContact, created] = await Contacts.findOrCreate({
        //             where:{ numberPhoneId:payload.source}, 
        //             defaults:{
        //                 name:payload.sender.name, 
        //                 notification:true, 
        //                 chatId:payload.payload.id,
        //                 phoneNumber: payload.source
        //             }})
                    
        //         await newContact.addBusiness(business);
        //         if (created && socialMediaId) {
        //             const socialMedia = await SocialMedia.findByPk(socialMediaId);
        //             if (!socialMedia)
        //               throw new Error(
        //                 `contact-socialMedia: Social Media with id ${socialMediaId} not found`
        //               );
        //             await newContact.setSocialMedia(socialMedia);
        //           }

        //         const newMsgReceived = await MsgReceived.create({
        //             chatId: payload.payload.id,
        //             text: payload.payload.text,
        //             name: payload.sender.name,
        //             numberPhoneId: payload.sender.id,
        //             timestamp: Date.now(),
        //             //timestamp: timestamp,
        //             phoneNumber: payload.payload.id,
        //             BusinessId: business.id,
        //             // active: true,
        //             // state: 'No Leidos',
        //             // received: true
        //         });
        //         console.log('llego un nuevo mensaje');
        //         // Asignar relaciones para MsgReceived
        //         await newMsgReceived.setBusiness(business);
        //         await newMsgReceived.setContact(newContact);
        //         if (socialMediaId) {
        //             const socialMedia = await SocialMedia.findByPk(socialMediaId);
        //             if (!socialMedia)
        //               throw new Error(
        //                 `msgReceived-socialMedia: Social Media with id ${socialMediaId} not found`
        //               );
        //             await newMsgReceived.setSocialMedium(socialMedia);
        //           }
        //         // Asignar relaciones para Contacts
        //         await newContact.setMsgReceived(newMsgReceived);

        //         const msgReceivedData = {
        //             chatId: payload.payload.id,
        //             text: payload.payload.text,
        //             name: payload.sender.name,
        //             numberPhoneId: payload.sender.id,
        //             timestamp: Date.now(),
        //             //timestamp: timestamp,
        //             phoneNumber: payload.payload.id,
        //             BusinessId: business.id,
        //             Business: {
        //               id: business.id,
        //               name: business.name
        //             },
        //             ContactId: newContact.id,
        //             Contact: {
        //                 id: newContact.id,
        //                 name: newContact.name,
        //                 phoneNumber: newContact.phoneNumber,
        //             },
        //             active: false,
        //             state: "No Leidos",
        //             received: true,
        //           };
          
        //           // Enviar los datos a la ruta específica
        //           await axios.post('http://localhost:3000/newMessageReceived', msgReceivedData);
        //           console.log("Datos del mensaje enviados a app desde Webhook");
        //     }
        // }
        
//         res.status(200).end()
//     })

//     return messageWebhook;
// }