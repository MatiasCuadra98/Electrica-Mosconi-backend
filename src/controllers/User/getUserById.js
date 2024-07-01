const {Business, User, MsgSent, Contact} = require('../../db')

const getUserById = async (id) => {

        const user = await User.findByPk(id, {
            include:[
                {
                    model: Business,
                    attributes: ['id', 'name']
                },
                {
                    model: MsgSent,
                    attributes: ['id', 'toData', 'message', 'timestamp', 'received'],
                    // attributes: ['id', 'toData', 'message', 'timestamp', 'received', 'contactId'],
                    // include: {
                    //     model: Contact,
                    //     attribute: ['id', 'name', 'email', 'phone']
                    // }
                }
        ]});
    if(!user) throw new Error (`User with ID ${id} not found`);
    
    return user;
};  

module.exports = {getUserById};