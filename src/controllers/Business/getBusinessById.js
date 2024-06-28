const {Business, User, SocialMedia, SocialMediaActive, Contact, MSgReceived, MsgSent} = require('../../db')
// const numberIdValidation = require('../../utils/numberIdvalidation')

const getBusinessById = async (id) => {
    // const businessId = await numberIdValidation(id)
    // const business = await Business.findByPk(businessId, {
    if(!id) throw new Error('Missing ID');
    const business = await Business.findByPk(id,
        //  {
        // include: [
        //     {
        //     model: User,
        //     atributtes: ['id', 'name']
        //     },
        //     {
        //     model: SocialMediaActive,
        //     attributes: ['id', 'dataUser'],
        //     // attributes: ['id', 'dataUser', 'socialMediaId'],
        //         // include: {
        //         //     model: SocialMedia,
        //         //     attributes: ['id', 'name', 'icon']
        //         // }
        //     },
        //     {
        //         model: Contact,
        //         attributes: ['name', 'email', 'phone', 'notification'],
        //         // attributes: ['name', 'email', 'phone', 'notification', 'msgReceivedId', 'msgSentId'],
        //         // include: [
        //         //     {model: MSgReceived,
        //         //         attributes: ['chatId', 'text', 'name', 'fromData', 'payload', 'timestamp', 'active', 'state', 'received']
        //         //     },
        //         //     {model: MsgSent,
        //         //         attributes:[ 'toData', 'message', 'timestamp', 'received', 'userId'],
        //         //         include: {
        //         //             model: User,
        //         //             attributes: ['id', 'name', 'privilege']
        //         //         }
        //         //     }
        //         // ]
        //     }
        // ]}
    );
    if(!business) throw new Error (`Business with Id ${id} not found`);
    
    return business;
};  

module.exports = {getBusinessById};