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

    }, {timestamps: false});
}