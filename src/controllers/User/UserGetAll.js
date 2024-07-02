const getAllUsers = require('../../handlers/User/getAllUsers')

const getUsers = async(req,res) =>{
    try {
        const allUsers = await getAllUsers()
        if(!allUsers || allUsers.length === 0) return res.status(200).json([])
        return res.status(200).json(allUsers)
    } catch (error) {
        return res.status(500).json({error:error.message})
    }
}

module.exports = getUsers