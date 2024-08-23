const {Router} = require('express');
const {messagesReceivedRoute} = require('./messagesReceivedRoutes');
const {messagesSentRoute} = require('./messagesSentRoutes');

const allMessagesRoute = Router();

allMessagesRoute.use('/received', messagesReceivedRoute)
allMessagesRoute.use('/sent', messagesSentRoute)

module.exports = {allMessagesRoute};
