require("dotenv").config();
const { Sequelize } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST, DATABASE_URL, DB_PORT, DB_NAME } =
  process.env;
const UserModel = require("./models/User");
const ContactsModel = require("./models/Contacts");
const BusinessModel = require("./models/Business");
const MsgReceivedModel = require("./models/MsgReceived");
const MsgSentModel = require("./models/MsgSent");
const SocialMediaModel = require("./models/SocialMedia");
const SocialMediaActiveModel = require("./models/SocialMediaActive");

const sequelize = new Sequelize(
  `postgres://mosconi:sPeXrQeTjv9b1cTvtFFPMZ06uVOHhhnC@dpg-cod8qp0l6cac73bf5nug-a.oregon-postgres.render.com/mosconi`,
  {
    dialectOptions: {
      ssl: {
        require: true,
      },
    },
    logging: false,
    native: false,
  }
);

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
//   logging: false,
//   native: false,
// });

UserModel(sequelize);
ContactsModel(sequelize);
BusinessModel(sequelize);
MsgReceivedModel(sequelize);
MsgSentModel(sequelize);
SocialMediaModel(sequelize);
SocialMediaActiveModel(sequelize);

//Associations

const {
  User,
  Business,
  MsgReceived,
  MsgSent,
  Contacts,
  SocialMedia,
  SocialMediaActive,
} = sequelize.models;
//1:N => Business y User
Business.hasMany(User, { timestamps: false });
User.belongsTo(Business, { timestamps: false });
//N:N => business y Contact
Business.belongsToMany(Contacts, {
  through: "business_contact",
  timestamps: false,
});
Contacts.belongsToMany(Business, {
  through: "business_contact",
  timestamps: false,
});
//1: N => business y MsgReceived
Business.hasMany(MsgReceived, { timestamps: false });
MsgReceived.belongsTo(Business, { timestamps: false });
//**CHEQUEAR QUE ESTA RELACION SEA NECESARIA**
//1:N => business y MsgSent
Business.hasMany(MsgSent, { timestamps: false });
MsgSent.belongsTo(Business, { timestamps: false });
//N:N => business y social Media active
Business.belongsToMany(SocialMediaActive, {
  through: "business_socialMediaActive",
  timestamps: false,
});
SocialMediaActive.belongsToMany(Business, {
  through: "business_socialMediaActive",
  timestamps: false,
});
//N:N => contacts y user
Contacts.belongsToMany(User, { through: "contact-user", timestamps: false });
User.belongsToMany(Contacts, { through: "contact-user", timestamps: false });
//1:N => contacts y msgReceived
Contacts.hasMany(MsgReceived, { timestamps: false });
MsgReceived.belongsTo(Contacts, { timestamps: false });
//1:N => contacts y msgSent
Contacts.hasMany(MsgSent, { timestamps: false });
MsgSent.belongsTo(Contacts, { timestamps: false });
// Relacion 1:N entre socialMedia y contact
Contacts.belongsTo(SocialMedia, { timestamps: false });
SocialMedia.hasMany(Contacts, { timestamps: false });
//N:N => msg recibido y enviado
MsgReceived.belongsToMany(MsgSent, {
  through: "msgReceived_msgSent",
  timestamps: false,
});
MsgSent.belongsToMany(MsgReceived, {
  through: "msgReceived_msgSent",
  timestamps: false,
});
//1:N => socialMedia y msgReceived
MsgReceived.belongsTo(SocialMedia, { timestamps: false });
SocialMedia.hasMany(MsgReceived, { timestamps: false });
//1:N => msgSent y user
User.hasMany(MsgSent, { timestamps: false });
MsgSent.belongsTo(User, { timestamps: false });
//N:N => socialMedia y socialMediaActive ***estoy en duda si debe ser N:N o 1:N***
SocialMedia.belongsToMany(SocialMediaActive, {
  through: "socialMedia_socialMediaActive",
  timestamps: false,
});
SocialMediaActive.belongsToMany(SocialMedia, {
  through: "socialMedia_socialMediaActive",
  timestamps: false,
});

const syncDatabase = async () => {
  // Rellenar la columna 'chatId' con un valor predeterminado si es NULL antes de sincronizar
  // await MsgReceived.update(
  //   { chatId: 0 },  // Proporcionar un valor predeterminado significativo para chatId
  //   { where: { chatId: null } }
  // );
  await sequelize.sync({ alter: true }); // Sincronizar base de datos con el modelo alterado

  // Rellenar la columna 'text' con un valor predeterminado si es NULL
  await MsgReceived.updateDefaultText();
};

module.exports = {
  User,
  Contacts,
  Business,
  MsgSent,
  MsgReceived,
  SocialMedia,
  SocialMediaActive,
  conn: sequelize,
  syncDatabase,
};
