const {Router} = require('express');
const {getAllMessagesReceivedHandler} = require('../../handlers/Message/messagesReceived/getAllMessagesReceivedHandler');
// const {getAllMessagesReceivedByContactHandler} = require('../../handlers/message/messagesReceived/getAllMessagesReceivedByContactHandler');
const {getMessageReceivedByIdHandler} = require('../../handlers/Message/messagesReceived/getMessageReceivedByIdHandler');
// const {updateStateMessageReceivedHandler} = require('../../handlers/message/messagesReceived/updateStateMessageReceivedHandler');
// const {updateFileMessageReceivedHandler} = require('../../handlers/message/messagesReceived/updateFileMessageReceivedHandler')
// const {updateActiveMessageReceivedHandler} = require('../../handlers/message/messagesReceived/updateActiveMessageReceivedHandler')


const messagesReceivedRoute = Router();

messagesReceivedRoute.get('/', getAllMessagesReceivedHandler);
// messagesReceivedRoute.get('byContact/:id', getAllMessagesReceivedByContactHandler);
messagesReceivedRoute.get('/:id', getMessageReceivedByIdHandler);
// messagesReceivedRoute.put('/state/:id', updateStateMessageReceivedHandler);
// messagesReceivedRoute.put('/file/:id', updateFileMessageReceivedHandler);
// messagesReceivedRoute.put('/active/:id', updateActiveMessageReceivedHandler);


module.exports = {messagesReceivedRoute};