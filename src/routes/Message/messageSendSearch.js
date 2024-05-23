const {Router} = require('express')
const messageSendSearchController = require('../../handlers/Message/messageSendSearch')

const messageSendSearch = Router()

messageSendSearch.get('/messageSendSearch', messageSendSearchController)

module.exports = messageSendSearch