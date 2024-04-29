const getBusinessById = require('../../handlers/Business/getBusinessById')


const controllerGetBusinessById = async(req,res) =>{
    const {id} = req.params
    try {
        const businessById = await getBusinessById(id)
        if(!businessById) return res.status.json({error:'company not found'})
        return res.status(200).json(businessById)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

module.exports = controllerGetBusinessById