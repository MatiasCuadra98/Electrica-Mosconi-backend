const {Router} = require('express')
const updateNotificationHandler = require('../../handlers/Contacts/updateNotification')

const putNotification = Router()

putNotification.put('/updateNotification',updateNotificationHandler)

module.exports=putNotification