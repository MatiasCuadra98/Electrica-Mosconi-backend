const { Router } = require('express')
const userPost = require("../../controllers/User/createUser")


const userRoute = Router()

userRoute.post('/createUser',userPost)

module.exports = userRoute