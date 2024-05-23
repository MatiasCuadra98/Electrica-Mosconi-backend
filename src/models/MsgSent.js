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
    timestamps: {
      type: DataTypes.DATE,
      allowNull: true
    },
    BusinessId: {
      type: DataTypes.INTEGER,
    },
  }, { timestamps: false });
};
