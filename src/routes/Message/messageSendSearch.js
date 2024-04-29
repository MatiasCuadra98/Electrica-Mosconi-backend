const {Router} = require('express')
const messageSendSearchController = require('../../controllers/Message/messageSendSearch')

const messageSendSearch = Router()

messageSendSearch.get('/messageSendSearch', messageSendSearchController)

module.exports = messageSendSearch