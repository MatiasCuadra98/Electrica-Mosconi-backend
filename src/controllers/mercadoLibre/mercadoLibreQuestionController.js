const axios = require('axios');

const mercadoLibreQuestionController = {
    // Obtiene las preguntas de los productos
    getQuestions: async (accessToken) => {
        const response = await axios.get('https://api.mercadolibre.com/questions/search', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                status: 'UNANSWERED' // Por ejemplo, preguntas no respondidas
            }
        });

        return response.data;
    }
};

module.exports = { mercadoLibreQuestionController };
