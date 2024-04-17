require('dotenv').config()
const { Sequelize } = require('sequelize')
const {DB_USER, DB_PASSWORD, DB_HOST,DATABASE_URL, DB_PORT, DB_NAME} = process.env
const UserModel = require('./models/User')
const ContactModel = require('./models/Contact')
const BusinessModel = require('./models/Business')
const MsgReceivedModel = require('./models/MsgReceived')
const MsgSentModel = require('./models/MsgSent')



const sequelize = new Sequelize(`postgres://mosconi:sPeXrQeTjv9b1cTvtFFPMZ06uVOHhhnC@dpg-cod8qp0l6cac73bf5nug-a.oregon-postgres.render.com/mosconi`, {dialectOptions: {
    ssl: {
      require: true}},logging:false, native: false})

//const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,{logging:false, native: false})
// postgres://fl0user:FN3gLZ9Prvmq@ep-green-pine-55017894.us-east-2.aws.neon.tech:5432/whatacart-db?sslmode=require
// const sequelize = new Sequelize(DATABASE_URL,{dialect:"postgres",logging:false})

UserModel(sequelize)
ContactModel(sequelize)
BusinessModel(sequelize)
MsgReceivedModel(sequelize)
MsgSentModel(sequelize)

//Associations

const { User,Business,MsgReceived,MsgSent,Contact } = sequelize.models

Contact.hasMany(User)
User.hasMany(Contact)

User.belongsTo(Business)
Business.hasMany(User)

MsgReceived.belongsTo(Business)
Business.hasMany(MsgReceived)

MsgSent.belongsTo(Business)
Business.hasMany(MsgSent)

Contact.belongsTo(Business)
Business.hasMany(Contact)

MsgReceived.belongsTo(Contact)
Contact.hasMany(MsgReceived)

MsgSent.belongsTo(Contact)
Contact.hasMany(MsgSent)




module.exports={
    User,
    Contact,
    Business,
    MsgSentModel,
    conn: sequelize,
}