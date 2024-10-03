const {SocialMediaActive} =require('../../../db')
const updateSocialMediaActive = async(id, dataUser) => {
    try {
       if(!id) throw new Error('Missing ID');
       const socialMediaToUpdate = await SocialMediaActive.findByPk(id) 
    
    if(!socialMediaToUpdate) {
        throw new Error(`Social Media with Id ${id} not found`)
    } else {
        socialMediaToUpdate.dataUser = dataUser;
        await socialMediaToUpdate.save();
        return `Congratulation! Social Media with ID ${id} has been updated`;
    }
    } catch (error) {
       throw error
        
    }
}

module.exports = {updateSocialMediaActive}