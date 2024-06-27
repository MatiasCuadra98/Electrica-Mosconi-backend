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
