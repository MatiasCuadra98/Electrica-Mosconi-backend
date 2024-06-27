// const {Router} = require('express');
// const {businessRoute} = require('./businessRoutes');
// const {userRoute} = require('./userRoutes');
// const {contactRoute} = require('./contactRoutes');
// const {socialMediaRoute} = require('./socialMedia/socialMediaRoutes');
// const {allMessagesRoute} = require('./messages/allMessagesRoutes');
// const {messageWebHook} = require('./messages/mesageWebhook')

// const routes = Router();


// module.exports = (io) => {
//     routes.use('/business', businessRoute); //ok => llega al handler => llega al controller
//     routes.use('/user', userRoute); //ok => llega al handler => llega al controller
//     routes.use('/contact', contactRoute); //ok => llega al handler => llega al controller
//     routes.use('/socialMedia', socialMediaRoute); //ok =>llega al handler => llega al controller
//     routes.use('/message', allMessagesRoute); //ok => llega al handler => llega al controller
//     routes.use("/", messageWebHook(io));
//     routes.use("/", messageSend(io)); 
//     return routes;
// }