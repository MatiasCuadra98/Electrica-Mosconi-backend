const axios = require('axios');

const mercadoLibreQuestionController = {
    getQuestions: async (accessToken) => {
        try {
            const response = await axios.get('https://api.mercadolibre.com/questions/search', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener las preguntas:', error.response?.data || error.message);
            throw new Error('No se pudieron obtener las preguntas.');
        }
    },
    getQuestionDetails: async (questionId, accessToken) => {
        if (!questionId) {
            console.error('El questionId es inválido o no está presente.');
            throw new Error('El questionId es inválido.');
        }
        try {
            const response = await axios.get(`https://api.mercadolibre.com/questions/${questionId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error al obtener los detalles de la pregunta ${questionId}:`, error.response?.data || error.message);
            throw new Error('No se pudieron obtener los detalles de la pregunta.');
        }
    },
    registerWebhook: async (accessToken, userId, applicationId) => {
        try {
            const response = await axios.post(`https://api.mercadolibre.com/users/${userId}/applications/${applicationId}/notifications`, {
                user_id: userId,
                topic: 'questions',
                application_id: applicationId,
                url: 'https://electrica-mosconi-server.onrender.com/mercadolibre/webhook',
                mode: 'self',
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log('Webhook registrado:', response.data);
        } catch (error) {
            console.error('Error al registrar el webhook:', error.response?.data || error.message);
            throw new Error('No se pudo registrar el webhook.');
        }
    }
};

module.exports = { mercadoLibreQuestionController };
