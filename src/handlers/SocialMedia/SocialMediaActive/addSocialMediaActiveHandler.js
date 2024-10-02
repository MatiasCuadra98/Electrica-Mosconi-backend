const {addSocialMediaActive} = require('../../../controllers/SocialMedia/SocialMediaActive/addSocialMediaActive')

const addSocialMediaActiveHandler = async (req, res) => {
    
    const{dataUser, active, socialMediaId, accessToken, refreshToken, authorizationCode, businessId} = req.body;
    //const{dataUser, active, socialMediaId, businessId} = req.body;
    console.log('data', req.body);
    
    try {
        if(!dataUser || !active || !businessId || !socialMediaId) throw new Error('Missing Data');
        // if(!dataUser || !active || !socialMediaId) throw new Error('Missing Data');
        const newSocialMediaActive = await addSocialMediaActive(dataUser, active, socialMediaId, accessToken, refreshToken, authorizationCode, businessId);
        // const newSocialMediaActive = await addSocialMediaActive(dataUser, active, socialMediaId);
        res.status(201).json(newSocialMediaActive)    
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {addSocialMediaActiveHandler};