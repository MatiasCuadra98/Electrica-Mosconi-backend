const {Router} = require('express')
const businessGetById = require('../../controllers/Business/businessGetById')

const BusinessGetByIdRouter = Router()

BusinessGetByIdRouter.get('/getBusiness/:id',businessGetById)

module.exports = BusinessGetByIdRouter