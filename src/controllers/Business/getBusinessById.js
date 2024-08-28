const {Business, User, SocialMedia, SocialMediaActive, Contacts, MsgReceived, MsgSent} = require('../../db')

const getBusinessById = async (id) => {
    if(!id) throw new Error('Missing ID');
    const business = await Business.findByPk(id,
         {
        include: [
            {
            model: User,
            atributtes: ['id', 'name']
            },
            {
            model: SocialMediaActive,
            attributes: ['id', 'dataUser'],
            include: [
                {
                    model: SocialMedia,
                    attributes: ['id', 'name', 'icon']
                }
            ]
            },
            {
            model: Contacts,
            attributes: ['id', 'name',  'phone', 'userName', 'Email'],
            //attributes: ['id', 'name'],
                include: [
                    {
                        model: MsgReceived,
                        attributes: ['id']
                    },
                    {
                        model: MsgSent,
                        attributes: ['id']
                    }
                ]
            },
        ]}
    );
    if(!business) throw new Error (`Business with Id ${id} not found`);
    
    return business;
};  

module.exports = {getBusinessById};