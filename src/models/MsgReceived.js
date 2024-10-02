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
      //chequear con Insta, face y Meli como registran el contacto
      idUser: {
        type: DataTypes.BIGINT,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
        timestamp: {
          type: DataTypes.BIGINT,
          allowNull: false,
        },
        phoneNumber: {
          type: DataTypes.BIGINT,
          allowNull: true,
          defaultValue: null
      },
      userName: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
      },
      Email: {
          type: DataTypes.STRING,
          allowNull: true,
          defaultValue: null,
      },
        BusinessId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        // //ESTO ES NUEVO
        // active: {
        //   type: DataTypes.BOOLEAN,
        //   allowNull: false,
        //   defaultValue: false
        // },
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
