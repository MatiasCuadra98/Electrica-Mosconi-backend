require('dotenv').config()
const { Sequelize } = require('sequelize')
const {DB_USER, DB_PASSWORD, DB_HOST,DATABASE_URL, DB_PORT, DB_NAME} = process.env
const UserModel = require('./models/User')
const ContactsModel = require('./models/Contacts')
const BusinessModel = require('./models/Business')
const MsgReceivedModel = require('./models/MsgReceived')
const MsgSentModel = require('./models/MsgSent')



const sequelize = new Sequelize(`postgres://mosconi:sPeXrQeTjv9b1cTvtFFPMZ06uVOHhhnC@dpg-cod8qp0l6cac73bf5nug-a.oregon-postgres.render.com/mosconi`, {dialectOptions: {
    ssl: {
      require: true}},logging:false, native: false})



UserModel(sequelize)
ContactsModel(sequelize)    
BusinessModel(sequelize)
MsgReceivedModel(sequelize)
MsgSentModel(sequelize)

//Associations

const { User,Business,MsgReceived,MsgSent,Contacts } = sequelize.models

Contacts.hasMany(User)
User.hasMany(Contacts)

User.belongsTo(Business)
Business.hasMany(User)

MsgReceived.belongsTo(Business)
Business.hasMany(MsgReceived)

MsgSent.belongsTo(Business)
Business.hasMany(MsgSent)

Contacts.belongsTo(Business)
Business.hasMany(Contacts)

MsgReceived.belongsTo(Contacts)
Contacts.hasMany(MsgReceived)

MsgSent.belongsTo(Contacts)
Contacts.hasMany(MsgSent)




module.exports={
    User,
    Contacts,
    Business,
    MsgSent,
    MsgReceived,
    conn: sequelize,
}