const {
  mercadoLibreAuthController,
} = require("../../controllers/mercadoLibre/mercadoLibreAuthController");
const { SocialMediaActive } = require("../../models/SocialMediaActive");

const mercadoLibreAuthHandler = async (req, res) => {
  try {
    if (req.query.code) {
      //const accessToken = await mercadoLibreAuthController.getAccessToken(req.query.code);
      //console.log("Token de acceso recibido:", accessToken);
      const { accessToken, refreshToken, authorizationCode } =
        await mercadoLibreAuthController.getAccessToken(req.query.code);
      console.log("Tokens de meli recibidos:", {
        accessToken,
        refreshToken,
        authorizationCode,
      });
      // Guardamos tokens en la bd
      await SocialMediaActive.create({
        dataUser: "+54 9 3487 34-7843", // Asegúrate de reemplazarlo por la data correcta
        active: true, // Puedes modificar según tu lógica
        socialMediaId: 5, // Reemplaza por el valor correcto de la red social
        accessToken: accessToken,
        refreshToken: refreshToken,
        authorizationCode: authorizationCode,
      });
      return res.json({
        message: "Tokens guardados correctamente en la base de datos",
      });
    } else {
      const authUrl = mercadoLibreAuthController.getAuthUrl();
      return res.redirect(authUrl);
    }
  } catch (error) {
    console.error("Error al redirigir a Mercado Libre:", error);
    res
      .status(500)
      .json({ message: "Error en la autenticación con Mercado Libre" });
  }
};

const mercadoLibreCallbackHandler = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res
        .status(400)
        .json({ message: "No se proporcionó el código de autorización." });
    }

    console.log("Código de autorización recibido:", code);
    //const accessToken = await mercadoLibreAuthController.getAccessToken(code);
    const { accessToken, refreshToken, authorizationCode } =
      await mercadoLibreAuthController.getAccessToken(code);

    //console.log("Token de acceso recibido:", accessToken);
    console.log("Tokens recibidos:", {
      accessToken,
      refreshToken,
      authorizationCode,
    });
    // Guardar los tokens en la base de datos
    await SocialMediaActive.create({
      dataUser: "+54 9 3487 34-7843", // Asegúrate de reemplazarlo por la data correcta
      active: true, // Puedes modificar según tu lógica
      socialMediaId: 5, // Reemplaza por el valor correcto de la red social
      accessToken: accessToken,
      refreshToken: refreshToken,
      authorizationCode: authorizationCode,
    });

    return res.json({
      message: "Tokens guardados correctamente en la base de datos",
    });
  } catch (error) {
    console.error(
      "Error al obtener el token de acceso:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Error al obtener el token de acceso" });
  }
};

module.exports = { mercadoLibreAuthHandler, mercadoLibreCallbackHandler };
