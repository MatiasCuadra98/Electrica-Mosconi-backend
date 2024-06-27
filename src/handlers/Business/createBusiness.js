const {Business} = require('../../db')

const createBusiness = async({name,password, address, city, country, phone, email,apiKey,srcName}) =>{

        const [newBusiness,created] = await Business.findOrCreate({
            where:{
                name,
                password, 
                address, 
                city, 
                country, 
                phone, 
                email,
                apiKey,
                srcName
            }
        })

        return newBusiness
}

module.exports = createBusiness