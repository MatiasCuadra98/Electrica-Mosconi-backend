const { MsgReceived, Business, Contacts } = require('../../../db');

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
      ],
    });
    if (!messages) throw new Error('Messages Received not found');
    return messages;
  };
  
  module.exports = { getAllMessagesReceived };
  