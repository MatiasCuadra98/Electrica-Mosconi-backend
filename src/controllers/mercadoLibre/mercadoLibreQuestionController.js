const axios = require('axios');

const mercadoLibreQuestionController = {
    getQuestions: async (accessToken, itemId) => {
        try {
            const response = await axios.get('https://api.mercadolibre.com/questions/search', {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: {
                    item: itemId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener las preguntas:', error);
            throw error;
        }
    }
};

module.exports = { mercadoLibreQuestionController };
