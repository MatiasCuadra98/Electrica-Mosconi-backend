const { Contacts, User, Business, MsgReceived, MsgSent, SocialMedia } = require('../../db');

const getContactById = async (id) => {

    const contact = await Contacts.findByPk(id, { 
        include:[
        {
            model: Business,
            attributes: ['id', 'name']
        },
        // {model: SocialMedia,
        //     attributes: ['id', 'name', 'icon']
        //   },
        {
            model: MsgReceived,
            attributes: ['id', 'chatId', 'text', 'name', 'fromData', 'payload', 'timestamp', 'active', 'state', 'received'],
        },
        {
                model: MsgSent,
                attribute: ['id', 'toData', 'message', 'timestamp', 'received'],
                // attribute: ['id', 'toData', 'message', 'timestamp', 'received', 'userId'],
                // include: {
                //     model: User,
                //     attribute: ['id', 'name', 'privilege']
                // }
            }
       ] })
  

  if(!contact)  throw new Error (`Contact with ID ${id} not found`);
  return contact;
};

module.exports = {getContactById};