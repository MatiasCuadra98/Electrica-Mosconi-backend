const { DataTypes } = require('sequelize');


module.exports = (sequelize) =>{
    sequelize.define('SocialMediaActive',{
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },  
        dataUser:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        active:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        socialMediaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        //tokens de mercado libre
        accessToken: {//este es para hacer llamados a la api
            type: DataTypes.STRING,
            allowNull: true
        },
        refreshToken: {//este actualiza el access token cuando expira cada 6hs
            type: DataTypes.STRING,
            allowNull: true
        },
        authorizationCode: { //este code se obtiene post autenticacion, se usa para obtener el access token
            type: DataTypes.STRING,
            allowNull: true
        },

    }, {timestamps: false});
}