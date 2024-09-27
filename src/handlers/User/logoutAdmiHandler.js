const {logoutAdmi} = require('../../controllers/User/logoutAdmi')

const logoutAdmiHandler = async (req, res) => {
    const {id} = req.params
    try {
        if(!id) throw new Error('Missing Data');
        await logoutAdmi(id);
        res.status(201).send('Logout')    
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {logoutAdmiHandler};