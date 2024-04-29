const {Business} = require('../../db')

const createBusiness = async({name,phone,email,apiKey,srcName}) =>{

        const [newBusiness,created] = await Business.findOrCreate({
            where:{
                name,
                phone,
                email,
                apiKey,
                srcName
            }
        })

        return newBusiness
}

module.exports = createBusiness