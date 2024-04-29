const {Router} = require('express')
const userGetAll = require('../../controllers/User/UserGetAll')

const UserGetAllRoute = Router()

UserGetAllRoute.get('/getUser',userGetAll)

module.exports = UserGetAllRoute
