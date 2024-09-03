const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();

// Configuración de la estrategia de Facebook
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "https://electrica-mosconi-server.onrender.com/auth/facebook/callback", // Reemplaza con tu URL
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    //aca podemos buscar en la base de datos al usuario por su Facebook ID
    // y crear uno nuevo si no existe.
    return done(null, profile);
  }
));

// Serialización del usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialización del usuario de la sesión
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
