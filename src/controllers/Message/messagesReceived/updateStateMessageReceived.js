const { MsgReceived } = require('../../../db');

const updateStateMessageReceived = async (id) => {
    if(!id) throw new Error('Missing Id')
    const message = await MsgReceived.findByPk(id);
    if(!message)  throw new Error (`Messages Received  with Id ${id} not found`);
    if(message.state === 'Archivados') throw new Error (`Messages Received  with Id ${id} hasn't been update`)
    message.state === 'No Leidos' ? message.state = 'Leidos' : message.state = 'Respondidos'
    
    await message.save();
    return(`Congratulation! The state from Message Received with ID ${id} has been update to ${message.state}`)
};

module.exports = {updateStateMessageReceived};