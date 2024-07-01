const {Router} = require('express');
const {messagesReceivedRoute} = require('./messagesReceivedRoutes');
// const {messagesSentRoute} = require('./messagesSentRoute');

const allMessagesRoute = Router();

allMessagesRoute.use('/received', messagesReceivedRoute)
// allMessagesRoute.use('/sent', messagesSentRoute)

module.exports = {allMessagesRoute};