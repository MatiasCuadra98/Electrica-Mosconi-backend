const {Router} = require('express')
const createBusiness = require('../../controllers/Business/businessPost')

const BusinessPostRoute = Router()

BusinessPostRoute.post('/createBusiness',createBusiness)

module.exports = BusinessPostRoute

