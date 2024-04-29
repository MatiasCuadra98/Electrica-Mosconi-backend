const {Router} = require('express')
const UserGetById = require('../../controllers/User/UserGetById')

const UserUserGetByIdRoute = Router()

UserUserGetByIdRoute.get('/getUser/:id',UserGetById)

module.exports = UserUserGetByIdRoute
