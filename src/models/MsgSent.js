const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('MsgSent', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    toData: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
      validate: {
        isObject(value) {
          if (typeof value !== 'object') {
            throw new Error('toData must be an object');
          }
        },
<<<<<<< HEAD
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
=======
        hasAppAndValue(value) {
          if (!value.app || !value.value) {
            throw new Error('toData must have both app and value properties');
          }
        },
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chatId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    BusinessId: {
      type: DataTypes.UUID,
      allowNull: true, // Permite valores nulos
    },
  }, { timestamps: false });

};
>>>>>>> 86dea8127573e21948d82705be873153ce487cc4
