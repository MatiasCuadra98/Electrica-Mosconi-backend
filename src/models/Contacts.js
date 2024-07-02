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
        phone:{
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
        
    },{timestamps:false})
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