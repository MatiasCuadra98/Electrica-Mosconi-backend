// const createUser = require("../../handlers/User/postUser")

// const userPost = async(req,res) =>{
    
//     const{name,email,password, phone, privilege, businessId} = req.body
//     try {
//         if(!name || !email || !password || !phone  || !privilege || !businessId) return res.status(404).json({error: 'required data not found'})
//         const newUser = await createUser(name,email,password, phone, privilege, businessId)
        
//         if(!newUser) return res.status(404).json({error: 'an error occurred while creating user'})
//         return res.status(200).json(newUser)
//     } catch (error) {
//         return res.status(500).json({error: error.message})
//     }
// }

// module.exports = userPost 

const {User, Business} = require('../../db');

    const createUser = async (name, email, password, phone, privilege, image, login, socketId, businessId, msgSentId ) => {


let isLogin = login === undefined || login === null || login === false ? false : login

console.log('controller2', login);
        const [newUser, created] = await User.findOrCreate({
            where: { email },
            defaults: {
              name, 
              password,
              phone,
              privilege,
              socketId,
              image,
              login: isLogin,
            }
          });
        
          if (created && businessId) {
            // Asociar el usuario al negocio correspondiente
            const business = await Business.findByPk(businessId);
            if (!business) throw new Error(`Business with id ${businessId} not found`);
            
            await newUser.setBusiness(business);
          }
            // businessId && await newUser.setBusiness(businessId); 
            // console.log('businessId', businessId);    
          
        msgSentId && await newUser.addMsgSent(msgSentId);
        
        return newUser;
    }

module.exports = {
    createUser
}