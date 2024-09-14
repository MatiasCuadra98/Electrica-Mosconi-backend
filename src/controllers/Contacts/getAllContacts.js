const { Contacts, Business, MsgReceived, MsgSent, SocialMedia } = require('../../db');
const getAllContacts = async () => {
    const contacts = Contacts.findAll(
        { order: [
            ['name'],
        ],
            include:[
                {
                    model: Business,
                    attributes: ['id', 'name']
                },
            //     {model: SocialMedia,
            //         attributes: ['id', 'name', 'icon']
            //       },
                {
                    model: MsgReceived,
                    attributes: ['id', 'chatId', 'text', 'name', 'timestamp', 'phoneNumber', 'userName', 'Email' ,'active', 'state', 'received'],
                    include: [
                        {
                          model: Business,
                          attributes: ['id', 'name'],
                        },
                        {
                          model: Contacts,
                          attributes: ['id', 'name', 'phone', 'userName', 'Email'],
                        },
                        {
                          model: SocialMedia,
                          attributes: ['id', 'name', 'icon']
                        }
                      ],
                },
            //     {
            //             model: MsgSent,
            //             attribute: ['id', 'toData', 'message', 'timestamp', 'received'],
            //         }
               ]
             })
          
        
          if(!contacts)  throw new Error ('Contacts not found');
          return contacts;
        }
    



module.exports = {getAllContacts}