const {Router} = require('express')
const businessGetAll = require('../../controllers/Business/businessGetAll')

const BusinessGetAllRouter = Router()

BusinessGetAllRouter.get('/getBusiness',businessGetAll)

module.exports = BusinessGetAllRouter