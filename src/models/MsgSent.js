const {DataTypes} = require('sequelize')

module.exports = (sequelize)=>{
    sequelize.define('MsgSent',{
        id:{
            type:DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        //PARA QUE ES NAME? NAME DE QUIEN CREA EL MENSAJE O DE EL RECEPTOR?
        name:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        toData: {
            type: DataTypes.JSON,
            allowNull: false,
            defaultValue: {}, // Default value for the object if not specified
            validate: {
              isObject(value) {
                if (typeof value !== 'object') {
                  throw new Error('yourObjectName must be an object');
                }
              },
              hasAppAndValue(value) {
                if (!value.app || !value.value) {
                  throw new Error('yourObjectName must have both app and value properties');
                }
              },
            },
          },
        message:{
            type:DataTypes.STRING,
            allowNull:false
        },
        timestamps:{
            type:DataTypes.DATE,
            allowNull:true
        },
        //ESTO ES NUEVO:
        received: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        }
    }, {timestamps: false})
} 