const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const http = require("http");
const { Server } = require("socket.io");
const { User } = require("./db");
const { enviarRespuestaManual } = require("./telegramBot/telegramBot");

require("dotenv").config();


const server = express();
const app = http.createServer(server);

const io = new Server(app, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
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

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

server.use(cors(corsOptions));
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`Received userId: ${userId}`); // Registro para depuración

  if (!userId) {
    console.error("userId is undefined or null");
    return; // Salir si userId no está definido
  }

    try {
    await User.update({ socketId: socket.id }, { where: { id: userId } });
    console.log(`Cliente conectado ${socket.id}`);
  } catch (error) {
    console.error("Error updating user:", error);
  }

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

server.post("/telegram/sendMessage", async (req, res) => {
  console.log('body:',  req.body);
  
  const { chatId, message, UserId } = req.body;
  console.log('en app', UserId);
  
  
  try {
    const response = await enviarRespuestaManual(chatId, message, UserId);
    if (response.success) {
      io.emit('NEW_MESSAGE_SENT', { chatId, message, UserId });
      console.log(`Evento 'NEW_MESSAGE_SENT' emitido con mensaje: ${message}`); // Log adicional para verificar la emisión

      res.status(200).send(response.message);
    } else {
      res.status(500).send(response.message);
    }
  } catch (error) {
    res.status(500).send("Error al enviar el mensaje: " + error.message);
  }
});
server.use("/", routes(io));

module.exports = app;
