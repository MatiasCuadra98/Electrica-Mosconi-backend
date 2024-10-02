const { mercadoLibreAuthController } = require('../../controllers/mercadoLibre/mercadoLibreAuthController');

const mercadoLibreAuthHandler = async (req, res) => {
    try {
        if (req.query.code) {
            const accessToken = await mercadoLibreAuthController.getAccessToken(req.query.code);
            console.log("Token de acceso recibido:", accessToken);
            
            // Guarda el token en la sesión o base de datos
            req.session.accessToken = accessToken; // Ejemplo de guardado en sesión
            return res.json({ accessToken });
        } else {
            const authUrl = mercadoLibreAuthController.getAuthUrl();
            return res.redirect(authUrl);
        }
    } catch (error) {
        console.error("Error al redirigir a Mercado Libre:", error);
        res.status(500).json({ message: 'Error en la autenticación con Mercado Libre' });
    }
};

const mercadoLibreCallbackHandler = async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ message: 'No se proporcionó el código de autorización.' });
        }

        console.log('Código de autorización recibido:', code);
        const accessToken = await mercadoLibreAuthController.getAccessToken(code);
        
        console.log("Token de acceso recibido:", accessToken);
        req.session.accessToken = accessToken; // Guardar el token en sesión o base de datos
        return res.json({ accessToken });
    } catch (error) {
        console.error("Error al obtener el token de acceso:", error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Error al obtener el token de acceso' });
    }
};

module.exports = { mercadoLibreAuthHandler, mercadoLibreCallbackHandler };
