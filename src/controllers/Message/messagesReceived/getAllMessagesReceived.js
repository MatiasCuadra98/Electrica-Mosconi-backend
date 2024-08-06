const { MsgReceived, Business, Contacts, SocialMedia } = require('../../../db');

const getAllMessagesReceived = async () => {
    const messages = await MsgReceived.findAll({
      order: [['timestamp']],
      include: [
        {
          model: Business,
          attributes: ['id', 'name'],
        },
        {
          model: Contacts,
          attributes: ['id', 'name', 'phone', 'notification'],
        },
        {
          model: SocialMedia,
          attributes: ['id', 'name']
        }
      ],
    });
    if (!messages) throw new Error('Messages Received not found');
    return messages;
  };
  
  module.exports = { getAllMessagesReceived };
  