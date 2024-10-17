const { mercadoLibreQuestionController } = require("../../controllers/mercadoLibre/mercadoLirbreQuestionsController");

const mercadoLibreQuestionHandler = async (req, res) => {
    try {
        const { accessToken } = req.body;
        if (!accessToken) {
            return res.status(400).json({ message: 'El token de acceso es requerido.' });
        }
        const questions = await mercadoLibreQuestionController.getQuestions(accessToken);
        return res.json(questions);
    } catch (error) {
        console.error('Error al manejar las preguntas:', error.message);
        res.status(500).json({ message: 'Error al obtener las preguntas.' });
    }
};

const mercadoLibreWebhookHandler = async (req, res) => {
    try {
        const question = req.body;
        console.log('Pregunta recibida:', question);
        const resource = question.resource;
        const questionId = resource.split('/').pop(); // Obtiene el ID de la pregunta desde el resource
        const accessToken = 'APP_USR-1309613645970920-101710-3fb2d77642793417720c5cd3a6f0bc51-232533265';

        const questionDetails = await mercadoLibreQuestionController.getQuestionDetails(questionId, accessToken);
        console.log('Detalles de la pregunta:', questionDetails);

        // Procesa la pregunta aquí
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error al manejar el webhook:', error.message);
        res.status(500).json({ message: 'Error al manejar el webhook.' });
    }
};

const mercadoLibreRegisterWebhookHandler = async (req, res) => {
    try {
        const { accessToken, userId, applicationId } = req.body;
        console.log('Parametros recibidos:', { accessToken, userId, applicationId });

        if (!accessToken || !userId || !applicationId) {
            console.error('Parametros faltantes');

            return res.status(400).json({ message: 'Token de acceso, userId y applicationId son requeridos.' });
        }
        await mercadoLibreQuestionController.registerWebhook(accessToken, userId, applicationId);
        return res.json({ message: 'Webhook registrado correctamente.' });
    } catch (error) {
        console.error('Error al registrar el webhook:', error.message);
        res.status(500).json({ message: 'Error al registrar el webhook.' });
    }
};

module.exports = { mercadoLibreQuestionHandler, mercadoLibreWebhookHandler, mercadoLibreRegisterWebhookHandler };
