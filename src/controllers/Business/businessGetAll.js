const getAllBusiness = require('../../handlers/Business/getAllBusiness.js')


const controllerGetBusiness = async(req,res) =>{
    
    try {
        const allBusiness = await getAllBusiness()
        if(!allBusiness) return res.status.json({error:'companies not found'})
        return res.status(200).json(allBusiness)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

module.exports = controllerGetBusiness