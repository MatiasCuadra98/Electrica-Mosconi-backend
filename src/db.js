require('dotenv').config()
const { Sequelize } = require('sequelize')
const {DB_USER, DB_PASSWORD, DB_HOST,DATABASE_URL, DB_PORT, DB_NAME} = process.env
const UserModel = require('./models/User')

const ContactModel = require('./models/Contact')



const sequelize = new Sequelize(`postgres://mosconi:sPeXrQeTjv9b1cTvtFFPMZ06uVOHhhnC@dpg-cod8qp0l6cac73bf5nug-a.oregon-postgres.render.com/mosconi`, {dialectOptions: {
    ssl: {
      require: true}},logging:false, native: false})

//const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,{logging:false, native: false})
// postgres://fl0user:FN3gLZ9Prvmq@ep-green-pine-55017894.us-east-2.aws.neon.tech:5432/whatacart-db?sslmode=require
// const sequelize = new Sequelize(DATABASE_URL,{dialect:"postgres",logging:false})

UserModel(sequelize)

ContactModel(sequelize)

//Associations

const { User,Contact } = sequelize.models

Contact.hasMany(User)
User.hasMany(Contact)




module.exports={
    User,
    Contact,
    conn: sequelize,
}