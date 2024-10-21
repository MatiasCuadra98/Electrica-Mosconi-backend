const { MsgReceived, Contacts, Business, SocialMedia } = require("../../db");
const { mercadoLibreQuestionController } = require("../../controllers/mercadoLibre/mercadoLirbreQuestionsController");

const businessId = "9231c626-a37b-4d89-ae16-fec670c9245b"; // ID de tu negocio
const socialMediaId = 5; // ID de Mercado Libre en SocialMedia
const accessToken = 'APP_USR-1309613645970920-102118-5fa6db0fe904769e44f7f05e2d8615de-232533265'; // Token para la API de Mercado Libre

// Handler para obtener preguntas
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

// Handler para procesar preguntas recibidas vía webhook
const mercadoLibreWebhookHandler = async (req, res) => {
    try {
        const question = req.body;
        console.log('Pregunta de meli recibida:', JSON.stringify(question, null, 2)); // Log detallado de la pregunta

        const resource = question.resource;
        const questionId = resource.split('/').pop(); // Obtiene el ID de la pregunta desde el resource

        // Obtener los detalles de la pregunta
        const questionDetails = await mercadoLibreQuestionController.getQuestionDetails(questionId, accessToken);
        console.log('Detalles de la pregunta de meli:', JSON.stringify(questionDetails, null, 2)); // Log detallado de los detalles de la pregunta

        const buyerId = questionDetails.from.id.toString();
        const buyerName = questionDetails.from.nickname || `Usuario_${buyerId}`;
        const questionText = questionDetails.text;
        const productId = questionDetails.item_id;
        const productTitle = questionDetails.item_title;
        const timestamp = new Date(questionDetails.date_created).getTime(); // Asegúrate de que este valor sea un BIGINT

         // Log de los valores que se van a insertar en la bd
         console.log('Valores a insertar:', {
            buyerId,
            buyerName,
            questionText,
            productId,
            timestamp,
        });


        // Paso 1: Buscar o crear el contacto
        const [newContact, created] = await Contacts.findOrCreate({
            where: { idUser: buyerId },
            defaults: {
                name: buyerName,
                notification: true,
                chatId: productId, // Usar el ID del producto como chatId
                phone: null, // Mercado Libre no proporciona número de teléfono
                businessId: businessId,
                SocialMediumId: socialMediaId,
            },
        });

        // Paso 2: Asociar el contacto con el negocio
        const business = await Business.findByPk(businessId);
        if (!business) {
            return res.status(404).send('Business no encontrado');
        }
        await newContact.addBusiness(business);

        // Paso 3: Asociar el contacto con la red social
        const socialMedia = await SocialMedia.findByPk(socialMediaId);
        if (!socialMedia) {
            return res.status(404).send('Social Media no encontrado');
        }
        await newContact.setSocialMedium(socialMediaId);

        // Paso 4: Crear el mensaje recibido
        const msgReceived = await MsgReceived.create({
            chatId: productId,
            idUser: buyerId,
            text: questionText,
            name: buyerName,
            timestamp: timestamp,
            phoneNumber: null, // No hay número de teléfono en Mercado Libre
            BusinessId: businessId,
            state: "No Leidos",
            received: true,
            userName: questionId,
        });

        // Paso 5: Asociar el mensaje recibido con el negocio, contacto, y red social
        await msgReceived.setBusiness(business);
        await msgReceived.setContact(newContact);
        await msgReceived.setSocialMedium(socialMediaId);

        console.log("Pregunta de Mercado Libre guardada en la base de datos:", msgReceived);

        // Responder con éxito
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error al manejar el webhook de meli:', error.message);
        res.status(500).json({ message: 'Error al manejar el webhook meli.' });
    }
};

// Handler para registrar el webhook de Mercado Libre
const mercadoLibreRegisterWebhookHandler = async (req, res) => {
    try {
        const { accessToken, userId, applicationId } = req.body;
        console.log('Parametros de meli recibidos:', { accessToken, userId, applicationId });

        if (!accessToken || !userId || !applicationId) {
            console.error('Parametros de meli faltantes');
            
            return res.status(400).json({ message: 'Token de acceso, userId y applicationId de meli son requeridos.' });
        }

        await mercadoLibreQuestionController.registerWebhook(accessToken, userId, applicationId);
        return res.json({ message: 'Webhook de meli registrado correctamente.' });
    } catch (error) {
        console.error('Error al registrar el webhook de meli:', error.message);
        res.status(500).json({ message: 'Error al registrar el webhook meli.' });
    }
};

module.exports = { mercadoLibreQuestionHandler, mercadoLibreWebhookHandler, mercadoLibreRegisterWebhookHandler };
