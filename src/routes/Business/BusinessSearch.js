const {Router} = require('express')
const businessSearch = require('../../controllers/Business/businessSearch')

const BusinessSearchRouter = Router()

BusinessSearchRouter.get('/searchBusiness',businessSearch)

module.exports = BusinessSearchRouter