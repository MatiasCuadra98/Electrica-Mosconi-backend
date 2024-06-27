    const { DataTypes } = require('sequelize');

<<<<<<< HEAD
module.exports = (sequelize) =>{
    sequelize.define('User',{
        id:{
            type:DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4
        },
        // name:{
        //     type: DataTypes.TEXT,
        //     allowNull: false,
        // },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                  msg: 'El nombre del usuario no puede estar vacío.'
                },
                len: {
                  args: [3, 100],
                  msg: 'El nombre del usuario debe tener entre 3 y 100 caracteres.'
                }
              }
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false
        },
        phone:{
            type: DataTypes.BIGINT,
            allowNull:false
        },
        privilege:{
            type: DataTypes.ENUM('Admin','Member'),
            allowNull: false,
        },
        socketId:{
            type:DataTypes.STRING
        },
        //**--ATRIBUTOS AGREGADOS--**
        image:{
            type: DataTypes.STRING,
            allowNull: true 
        },
        login: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
=======
    module.exports = (sequelize) =>{
        sequelize.define('User',{
            id:{
                type:DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name:{
                type: DataTypes.TEXT,
                allowNull: false,
            },
            email:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            password:{
                type: DataTypes.STRING,
                allowNull: false
            },
            phone:{
                type: DataTypes.BIGINT,
                allowNull:false
            },
            privilege:{
                type: DataTypes.ENUM('Admin','Member'),
                allowNull: false,
            },
            socketId:{
                type:DataTypes.STRING
            },
        
            image:{
                type: DataTypes.STRING,
                allowNull: true 
            },
            login: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
>>>>>>> 86dea8127573e21948d82705be873153ce487cc4

            }
        }, {timestamps: false});
    }