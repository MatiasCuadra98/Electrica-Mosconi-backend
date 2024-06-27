const {Business} = require('../../db');

    const createBusiness = async (name, password, address, city, country, email, phone, apiKey, userId, contactId, socialMediaActiveId) => {

            const [newBusiness, created] = await Business.findOrCreate({
                where: {
                    name,
                    password,
                    address,
                    city, 
                    country, 
                    email,
                    phone,
                    apiKey,
                },
            })
            
            userId && await newBusiness.setUser(userId);
            contactId && await newBusiness.addContact(contactId);
            socialMediaActiveId && await newBusiness.addSocialMediaActive(socialMediaActiveId)

            // console.log('newBusiness', newBusiness);
    
            return newBusiness;
            
    
    };

module.exports = {createBusiness};