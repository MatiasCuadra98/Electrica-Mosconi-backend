const { DataTypes } = require('sequelize');

module.exports = (sequelize) =>{
    sequelize.define('Business',{
        id:{
            type:DataTypes.UUID,
            allowNull: true,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        name:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        phone:{
            type: DataTypes.BIGINT,
            allowNull:false
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false
        },
        apiKey:{
            type:DataTypes.STRING,
            allowNull:false
        },
        srcName:{
            type:DataTypes.STRING,
            allowNull:false
        }
    }, {timestamps: false});
}