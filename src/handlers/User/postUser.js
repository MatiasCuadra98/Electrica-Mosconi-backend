const {User} = require('../../db')

const createUser = async(name,email,password,phone,privilege, businessId) =>{
        const [newUser,created] = await User.findOrCreate({where:{name:name},defaults:{
            email,
            password,
            phone,
            privilege,
            //BusinessId: businessId
        }
        })
        console.log('Hola');
    //**--ASOCIO EL NUEVO USUARIO A UN BUSINESS */
        await newUser.setBusiness(businessId);
        return newUser;
};

module.exports = createUser;
