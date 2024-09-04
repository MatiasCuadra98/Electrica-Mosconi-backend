const { Router } = require('express')
const {Business,User,MsgReceived, Contacts, SocialMedia} = require('../../db')
const axios = require('axios')

 const messageWebHook = Router()

module.exports = (io)=>{
    //ruta para recibir mensajes
    messageWebHook.post('/messageWebHook', async (req, res) =>{
      console.log('webhook alcanzado al recibir un mensaje');
      //console.log('mensaje recibido:', req.body);
      const businessId = "3c3518bb-9639-4055-91ee-1768f56a77d1"; 
      const socialMediaId = 1; //id de telegram
      
      
      const { message } = req.body
      //console.log('mensaje recibido:', message)
      if (!message) {
        console.error('No se recibió un msg en el body');
        return res.status(400).send('Bad Request: No msg in body');
      }

      const chatId = message.chat.id;
      const messageReceived = message.text;
      const senderName = message.from.first_name;
      const senderIdUser = message.from.id;

      try {
        const business = await Business.findByPk(businessId)
        if (!business) {
          return res.status(404).send('Business no encontrado');
        };
        const socialMedia = await SocialMedia.findByPk(socialMediaId);
        console.log('red social:', socialMedia);
        
        if (!socialMedia) {
          return res.status(404).send('Social Media no encontrado');
        }
      
        const [newContact, created] = await Contacts.findOrCreate({
          where: {idUser: senderIdUser },
          defaults: {
            name: senderName,
            notification: true,
            chatId: chatId,
            phone: senderIdUser,
            businessId: businessId
            //SocialMediumId: socialMediaId
          }
        });
        console.log('contacto creado');
          // Asociar el contacto con el negocio
          if (created && business) {
          //   const business = await Business.findByPk(businessId);
          //   if (!business)
          //     throw new Error(
          //   `contact-business: Business with id ${businessId} not found`
          // );
          await newContact.addBusiness(business);
        }
        // Asociar el contacto con la red social
        if (created && socialMedia) {
          // const socialMedia = await SocialMedia.findByPk(socialMediaId);
          console.log('redSocial', socialMedia );
          // if (!socialMedia)
          //   throw new Error(
          //       `contact-socialMedia: Social Media with id ${socialMediaId} not found`
          //     );
            await newContact.setSocialMedia(socialMedia);
            const contactWithSocialMedia = await Contacts.findByPk(newContact.id, {
              include: SocialMedia
            });
            console.log('Contacto con Social Media asociada:', contactWithSocialMedia);
          
          }

        //console.log('contacto creado con asociaciones:', newContact);

        if(!newContact) {
        console.log('el contacto no fue creado ni encontrado', error.message);
        
      }
        
        const contact = await Contacts.findOne({ where: { phone: senderIdUser } });
        if (!contact) throw new Error(`Contact not found`);

        console.log('contacto encontrado', contact);
        
         // Crear el mensaje recibido
    const msgReceived = await MsgReceived.create({
      chatId: chatId,
      idUser: senderIdUser,
      text: messageReceived,
      name: senderName,
      timestamp: Date.now(),
      phoneNumber: chatId,
      BusinessId: businessId,
      active: false,
      state: "No Leidos",
      received: true,
    });

    //console.log('mensaje recibido y creado sin asociaciones:', msgReceived);
    
  // Asociar el mensaje recibido con el negocio
  if (business) {
    // const business = await Business.findByPk(businessId);
    // if (!business)
    //   throw new Error(
    //     `msgReceived-business: Business with id ${businessId} not found`
    //   );
    await msgReceived.setBusiness(business);
  }

  // Asociar el mensaje recibido con el contacto
  await msgReceived.setContact(contact);

  // Asociar el mensaje recibido con la red social
  if (socialMedia) {
    // const socialMedia = await SocialMedia.findByPk(socialMediaId);
    // if (!socialMedia)
    //   throw new Error(
    //     `msgReceived-socialMedia: Social Media with id ${socialMediaId} not found`
    //   );
    await msgReceived.setSocialMedium(socialMedia);
  }
    
    console.log("Mensaje recibido y guardado en la base de datos desde WEBHOOK:");

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

return messageWebHook;
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
          
                  // Enviar los datos a la ruta específica
        //           await axios.post('https://electrica-mosconi-server.onrender.com/newMessageReceived', msgReceivedData);
        //           console.log("Datos del mensaje enviados a app desde Webhook");
        //     }
        // }

        
//         res.status(200).end()
//     })

//     return messageWebhook;
// }