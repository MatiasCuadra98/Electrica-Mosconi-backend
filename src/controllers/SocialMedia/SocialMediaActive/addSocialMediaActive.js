const { SocialMediaActive, Business, SocialMedia} = require('../../../db');

    const addSocialMediaActive = async (dataUser, active, socialMediaId, accessToken, refreshToken, authorizationCode, businessId ) => {    
//const addSocialMediaActive = async (dataUser, active, socialMediaId, businessId ) => {
        const [newSocialMediaActive, created] = await SocialMediaActive.findOrCreate({
            where: {
                dataUser, 
                active, 
                socialMediaId,
                accessToken,
                refreshToken,
                authorizationCode
            }
        })
        const business = await Business.findByPk(businessId);
        const socialMedia = await SocialMedia.findByPk(socialMediaId);
    
        business && await newSocialMediaActive.addBusiness(business);
        socialMedia && await newSocialMediaActive.addSocialMedia(socialMedia);
    //    businessId && await newSocialMediaActive.addBusiness(businessId);
    // // if (businessId) {
    // //     const business = await Business.findByPk(businessId);
    // //     if (business) {
    // //       await newSocialMediaActive.addBusiness(business);
    // //     }
    // //   }
    //    socialMediaId && await newSocialMediaActive.addSocialMedia(socialMediaId);

        return newSocialMediaActive;
    }

module.exports = {
    addSocialMediaActive
}