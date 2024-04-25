const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "MsgReceived",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
          hasAppAndValue(value) {
            if (!value.app || !value.value) {
              throw new Error(
                "yourObjectName must have both app and value properties"
              );
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
    },
    { timestamps: false }
  );
};
