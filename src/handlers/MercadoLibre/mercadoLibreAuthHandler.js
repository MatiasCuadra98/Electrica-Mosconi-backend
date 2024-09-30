const { mercadoLibreAuthController } = require('../../controllers/mercadoLibre/mercadoLibreAuthController');

// Handler para la autenticación con Mercado Libre
const mercadoLibreAuthHandler = async (req, res) => {
    try {
        // Si no hay "code", redirige al usuario a la página de autenticación de Mercado Libre
        if (!req.query.code) {
            const authUrl = mercadoLibreAuthController.getAuthUrl();
            return res.redirect(authUrl);
        }

        // Si hay un "code", obtén el token de acceso
        const accessToken = await mercadoLibreAuthController.getAccessToken(req.query.code);
        return res.json({ accessToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en la autenticación con Mercado Libre' });
    }
};

module.exports = { mercadoLibreAuthHandler };
