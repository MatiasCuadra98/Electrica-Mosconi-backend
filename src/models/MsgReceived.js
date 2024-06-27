const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const MsgReceived = sequelize.define(
    "MsgReceived",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      chatId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      fromData: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {}, // Default value for the object if not specified
        validate: {
          isObject(value) {
            if (typeof value !== "object") {
              throw new Error("yourObjectName must be an object");
            }
          },
          
        },
<<<<<<< HEAD
        timestamp:{
            type: DataTypes.BIGINT,
            allowNull: false
        },
        //ESTO ES NUEVO
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        state: {
          type: DataTypes.ENUM,
          //hay que cambiar el front para usar los values en Ingles
          values: ['No Leidos', 'Leidos', 'Respondidos', 'Archivados'],
          defaultValue: "No Leidos",
          // values: ['New', 'Read', 'Answered', 'Archived'],
          // defaultValue: "New",
          allowNull: false,
        },
        received: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
    }, {timestamps: false})
}
=======
      },
      payload: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      responded: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      BusinessId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    { timestamps: false }
  );

  MsgReceived.updateDefaultText = async function () {
    await this.update(
      { text: 'default text' },  // Proporcionar un valor predeterminado significativo
      { where: { text: null } }
    );
  };

  return MsgReceived;

};
>>>>>>> 86dea8127573e21948d82705be873153ce487cc4
