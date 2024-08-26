const {MsgSent, Business, Contacts, SocialMedia, User} = require('../../../db');

const getAllMessagesSent = async () => {
    const messages = await MsgSent.findAll({
        order: [['timestamp']],
      include: [
        {
          model: Business,
          attributes: ['id', 'name'],
        },
        {
          model: Contacts,
          attributes: ['id', 'name', 'phoneNumber', 'userName', 'Email'],
        },
        {
          model: SocialMedia,
          attributes: ['id', 'name', 'icon']
        }, 
        {
            model: User,
            attributes: ['id', 'name']
        }, 
      ],
    })
    if (!messages) throw new Error('Messages Sent not found');
    return messages;
};

module.export = {getAllMessagesSent};