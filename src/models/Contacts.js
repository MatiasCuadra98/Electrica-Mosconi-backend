const { all } = require('axios')
const {DataTypes} = require('sequelize')

module.exports = (sequelize)=>{
    sequelize.define('Contacts',{
        id:{
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false
        },
        idUser:{
            type: DataTypes.BIGINT,
            allowNull: false
        }, 
        notification:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        chatId: {
            type: DataTypes.BIGINT,
            allowNull: false,
          },
        phone: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: null
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        }
    },     
    {timestamps:false})
}

