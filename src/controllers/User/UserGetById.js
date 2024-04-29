const getUserById = require('../../handlers/User/getUserById')

const getUser = async(req,res) =>{
    const {id} = req.params
    try {
        const userById = await getUserById(id)
        if(!userById) return res.status(200).json([])
        return res.status(200).json(userById)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

module.exports = getUser