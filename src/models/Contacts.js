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
        conversationId:{
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
        phoneNumber: {
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
            unique: true,
            validate: {
              isEmail: {
                msg: 'El correo electrónico debe tener un formato válido.'
              }
            }
        }
    },     
    {timestamps:false})
}

//CHEQUAR A FUTURO: NO TODAS LAS REDES SOCIALES DAN TODOS LOS DATOS!!!
// id:{
//     type: DataTypes.UUID,
//     allowNull: false,
//     primaryKey: true,
//     defaultValue: DataTypes.UUIDV4
// },
// name:{
//     type: DataTypes.STRING,
//     allowNull: true,
// },
// email: {
//     type: DataTypes.STRING,
//     allowNull: true,
//     unique: true,
//   },
// phone:{
//     type: DataTypes.INTEGER,
//     allowNull: true,
// },
// notification:{
//     type: DataTypes.BOOLEAN,
//     allowNull: false,
//     defaultValue: false
// },
// }, {timestamps: false});
// }