const {updateSocialMediaActive} = require('../../../controllers/SocialMedia/SocialMediaActive/updateSocialMediaActive')

const updateSocialMediaActiveHandler = async (req, res) => {
    const {dataUser} =req.body;
    const {id} =req.params;
    try {
        if(!id || !dataUser) throw new Error('Missing Data');
        const result = await updateSocialMediaActive(id, dataUser);
        res.status(200).send(result);
  
    } catch (error) {
        res.status(500).json({ error: error.message });  
    }
}
module.exports = {updateSocialMediaActiveHandler}