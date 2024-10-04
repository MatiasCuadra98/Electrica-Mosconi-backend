const axios = require("axios");
const { MsgReceived } = require("../../db");
const { SocialMediaActive } = require("../../db");
const { mercadoLibreAuthController } = require("./mercadoLibreAuthController");

const mercadoLibreQuestionController = {
    getQuestions: async (accessToken, itemId, BusinessId) => {
        try {
            if (!itemId) {
                throw new Error("El parámetro itemId es requerido");
            }
            const response = await axios.get(
                "https://api.mercadolibre.com/questions/search",
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                    params: { item: itemId }
                }
            );

            const questions = response.data.questions;

            for (const question of questions) {
                await MsgReceived.create({
                    id: question.id,
                    chatId: question.from.id,
                    idUser: question.from.id,
                    text: question.text,
                    name: question.from.nickname || "name desconocido",
                    timestamp: new Date(question.date_created).getTime(),
                    phoneNumber: null,
                    userName: question.from.nickname || "userName desconocido",
                    Email: null,
                    BusinessId: BusinessId,
                    active: true,
                    state: 'No Leidos',
                    received: true
                });
            }

            return questions;
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log("Token de acceso expirado. Renovando...");
                // Buscamos el refresh token en la base de datos
                const socialMediaData = await SocialMediaActive.findOne({ where: { socialMediaId: 5 } });
                const { refreshToken } = socialMediaData;

                // Renovamos el access token
                const { accessToken: newAccessToken, newRefreshToken } = await mercadoLibreAuthController.refreshAccessToken(refreshToken);

                // Actualizamos el token en la base de datos
                await SocialMediaActive.update(
                    { accessToken: newAccessToken, refreshToken: newRefreshToken },
                    { where: { socialMediaId: 5 } }
                );

                // Reintentamos la solicitud con el nuevo token
                return await mercadoLibreQuestionController.getQuestions(newAccessToken, itemId, BusinessId);
            }

            console.error("Error al obtener las preguntas:", error);
            throw error;
        }
    }
};

module.exports = { mercadoLibreQuestionController };
