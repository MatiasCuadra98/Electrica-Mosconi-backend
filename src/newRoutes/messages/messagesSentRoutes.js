// const {Router} = require('express');
// const {getAllMessagesSentHandler} = require('../../handlers/message/messagesSent/getAllMessagesSentHandler');
// const {getAllMessagesSentByContactHandler} = require('../../handlers/message/messagesSent/getAllMessagesSentByContactHandler');
// const {getAllMessagesSentByUserHandler} = require('../../handlers/message/messagesSent/getAllMessagesSentByUserHandler');
// const {getMessageSentByIdHandler} = require('../../handlers/message/messagesSent/getMessageSentByIdHandler');
// const {createMessageSentHandler} = require('../../handlers/message/messagesSent/createMessageSentHandler');
// const {updateMessageSentHandler} = require('../../handlers/message/messagesSent/updateMessageSentHanlder');
// const {deleteMessageSentHandler} = require('../../handlers/message/messagesSent/deleteMessageSentHandler');

// const messagesSentRoute = Router();

// messagesSentRoute.get('/', getAllMessagesSentHandler);
// messagesSentRoute.get('/byContact/:id', getAllMessagesSentByContactHandler);
// messagesSentRoute.get('/byUser/:id', getAllMessagesSentByUserHandler);
// messagesSentRoute.get('/:id', getMessageSentByIdHandler);
// messagesSentRoute.post('/create/', createMessageSentHandler);
// messagesSentRoute.put('/update/:id', updateMessageSentHandler);
// messagesSentRoute.delete('/delete/:id', deleteMessageSentHandler);

// module.exports = {messagesSentRoute};