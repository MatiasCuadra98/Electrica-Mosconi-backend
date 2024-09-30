const { mercadoLibreAuthController } = require('../../controllers/mercadoLibre/mercadoLibreAuthController');

// Handler para iniciar la autenticación con Mercado Libre
const mercadoLibreAuthHandler = async (req, res) => {
    try {
        // Si no hay "code", redirige al usuario a la página de autenticación de Mercado Libre
        if (!req.query.code) {
            const authUrl = mercadoLibreAuthController.getAuthUrl();
            return res.redirect(authUrl);
        }
    } catch (error) {
        console.error("Error al redirigir a Mercado Libre:", error);
        res.status(500).json({ message: 'Error en la autenticación con Mercado Libre' });
    }
};

// Handler para manejar el callback de Mercado Libre y obtener el token de acceso
const mercadoLibreCallbackHandler = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ message: 'No se proporcionó el código de autorización.' });
        }

        // Obtener el token de acceso usando el código de autorización
        const accessToken = await mercadoLibreAuthController.getAccessToken(code);
        
        console.log("Token de acceso recibido:", accessToken);

        // Puedes redirigir al frontend con el token, o simplemente devolverlo como respuesta JSON
        return res.json({ accessToken });
    } catch (error) {
        console.error("Error al obtener el token de acceso:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error al obtener el token de acceso' });
    }
};

module.exports = { mercadoLibreAuthHandler, mercadoLibreCallbackHandler };
