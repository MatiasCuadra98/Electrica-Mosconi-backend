const { getMessageReceivedById } = require('../../../controllers/Message/messagesReceived/getMessagereceivedById');
// C:\Users\HP\Desktop\APP\Mosconi\Api\Electrica-Mosconi-backend\src\controllers\Message\messagesReceived\getMessageReceivedById.js
// Api\Electrica-Mosconi-backend\src\controllers\Message\messagesReceived\getMessageReceivedById.js
//no se porque no me esta tomando esta ruta correcta
// const { getMessageReceivedById } = require('../../../controllers/Message/messagesReceived/getMessageReceivedById');
const getMessageReceivedByIdHandler = async(req, res) => {
    const {id} = req.params;
    try {
        if(!id) throw new Error('Missing ID');
        const message = await getMessageReceivedById(id);
        !message ? res.status(400).send('Message not found') : res.status(200).json(message); 
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {getMessageReceivedByIdHandler};