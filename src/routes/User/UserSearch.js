const {Router} = require('express')
const UserSearch = require('../../controllers/User/UserSearch')

const UserSearchRoute = Router()

UserSearchRoute.get('/userSearch',UserSearch)

module.exports = UserSearchRoute
