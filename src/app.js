const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./newRoutes");
const http = require("http");
const { Server } = require("socket.io");
const { User } = require("./db");
const { enviarRespuestaManual } = require("./telegramBot/telegramBot");
const axios = require("axios");

const server = express();
const app = http.createServer(server);

const io = new Server(app, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
  },
});

server.name = "server";

server.use(
  cors({
    origin: "*",
    credentials: true,
    methods: "GET, POST, OPTIONS, PUT, DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
  })
);
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  await User.update({ socketId: socket.id }, { where: { id: userId } });
  console.log(`Cliente conectado ${socket.id}`);
  console.log(userId);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

server.post("/telegram/sendMessage", async (req, res) => {
  const { chatId, message, userId } = req.body;
  try {
    const response = await enviarRespuestaManual(chatId, message, userId);
    if (response.success) {
      res.status(200).send(response.message);
    } else {
      res.status(500).send(response.message);
    }
  } catch (error) {
    res.status(500).send("Error al enviar el mensaje: " + error.message);
  }
});

// Webhook for WhatsApp
server.post("/webhook", async (req, res) => {
  console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
//chequea si la request al webhook contiene un mensaje
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];
//chequea si el mensaje entrante contiene texto
  if (message?.type === "text") {
    const business_phone_number_id =
      req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
      //manda un mensaje de respuesta con "Echo"
      try {
        await axios({
          method: "POST",
          url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
          headers: {
            Authorization: `Bearer ${process.env.GRAPH_API_TOKEN.trim()}`, //trim para borrar espacios vacios en el token
            'Content-Type': 'application/json'
          },
          data: {
            messaging_product: "whatsapp",
            to: message.from,
            text: { body: "Echo: " + message.text.body },
            context: {
              message_id: message.id,
            },
          },
        });
      } catch (error) {
        console.error("Error sending message:", error.response?.data || error.message);

      }
    
    //marca el mensaje entrante como leido
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${process.env.GRAPH_API_TOKEN.trim()}`,
        'Content-Type': 'application/json'
      },
      data: {
        messaging_product: "whatsapp",
        status: "read",
        message_id: message.id,
      },
    });
  }

  res.sendStatus(200);
});

server.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    console.log("Webhook verified successfully!");
  } else {
    res.sendStatus(403);
  }
});

server.use("/", routes(io));

module.exports = app;
