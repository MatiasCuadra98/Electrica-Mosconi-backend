const axios = require("axios");
const { MsgReceived } = require("../../models/MsgReceived");

const mercadoLibreQuestionController = {
  getQuestions: async (accessToken, itemId, BusinessId) => {
    try {
      const response = await axios.get(
        "https://api.mercadolibre.com/questions/search",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { item: itemId, 
                    BusinessId: "53c2e647-ce26-41f7-915e-aac13b11c92a"
           },
        }
      );
      //agrego variable que guarde las preguntas
      const questions = response.data.questions;

      //Guardamos las preguntas en la base de datos, iteramos sobre la variable creada antes y guardamos la data
      for (const question of questions) {
        await MsgReceived.create({
            id: question.id, // Usamos el id de la pregunta como id en el modelo
            chatId: question.from.id, // El id del usuario que hace la pregunta
            idUser: question.from.id, // Id del usuario que hizo la pregunta
            text: question.text, // Texto de la pregunta
            name: question.from.nickname, // Nombre del usuario
            timestamp: new Date(question.date_created).getTime(), // Convertir la fecha a timestamp
            phoneNumber: null, // Mercado Libre no proporciona el teléfono directamente asi q lo podemos sacar a esta linea
            userName: question.from.nickname, // Nombre del usuario
            Email: null, // Email también no está disponible directamente la podemos sacar a esta linea
            BusinessId: BusinessId, // El BusinessId que envías desde el handler
            active: true, // Estado activo del mensaje
            state: 'No Leidos', // Por defecto "No Leidos"
            received: true // Indicador de que es un mensaje recibido
        });
    }
      return response.data;
    } catch (error) {
      console.error("Error al obtener las preguntas:", error);
      throw error;
    }
  },
};

module.exports = { mercadoLibreQuestionController };
