const {createBusiness} = require('../../controllers/business/createBusiness')

const createBusinessHandler = async (req, res) => {
    const{name, password, address, city, country, email, phone, apiKey} = req.body;
    
    try {
        if(!name || !password || !country || !email || !apiKey) throw new Error('Missing Data');
        const newBusiness = await createBusiness(name, password, address, city, country, email, phone, apiKey);
        res.status(201).json(newBusiness)    
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

module.exports = {createBusinessHandler};