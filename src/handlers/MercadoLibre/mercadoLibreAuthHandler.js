const { mercadoLibreAuthController } = require('../../controllers/mercadoLibre/mercadoLibreAuthController');

// Handler para iniciar la autenticación con Mercado Libre
const mercadoLibreAuthHandler = async (req, res) => {
    try {
        // Si hay "code", se procesa para obtener el access token
        if (req.query.code) {
            const accessToken = await mercadoLibreAuthController.getAccessToken(req.query.code);
            console.log("Token de acceso recibido:", accessToken);
            // Aquí puedes guardar el token en la sesión o base de datos si es necesario
            // Redirigir al frontend o enviar el token en la respuesta
            return res.json({ accessToken });
        } else {
            // Redirige a la URL de autenticación si no hay código
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

        console.log('Código de autorización recibido:', code);

        // Obtener el token de acceso usando el código de autorización
        const accessToken = await mercadoLibreAuthController.getAccessToken(code);
        
        console.log("Token de acceso recibido:", accessToken);

        // Puedes redirigir al frontend con el token o simplemente devolverlo como respuesta JSON
        return res.json({ accessToken });
    } catch (error) {
        console.error("Error al obtener el token de acceso:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error al obtener el token de acceso' });
    }
};

module.exports = { mercadoLibreAuthHandler, mercadoLibreCallbackHandler };
