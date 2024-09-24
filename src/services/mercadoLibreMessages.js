// archivo: services/mercadolibreMessages.js
const axios = require('axios');

async function getQuestionDetails(questionId, access_token) {
    try {
        const response = await axios.get(`https://api.mercadolibre.com/questions/${questionId}`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener detalles de la pregunta:', error.response.data);
    }
}

module.exports = getQuestionDetails;
