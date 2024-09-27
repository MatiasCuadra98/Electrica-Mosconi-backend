const {loginAdmi} = require('../../controllers/User/loginAdmi')

const loginAdmiHandler = async (req, res) => {
    const {id} = req.params
    try {
        if(!id) throw new Error('Missing Data');
        await loginAdmi(id);
        res.status(201).send('Login')    
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {loginAdmiHandler};