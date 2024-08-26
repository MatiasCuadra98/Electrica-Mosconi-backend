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
    origin: "*",
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
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

server.use(cors(corsOptions));
server.use(morgan("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;
  console.log('CONEXION A SOCKET EXITOSA');
  
  //console.log(`Received userId: ${userId}`); // Registro para depuración

  if(io) {
    io.emit("SE_EMITEN_OTRAS_COSAS", "ok");
   // message && io.emit("NEW_MESSAGE_RECEIVED", message)

  }

  server.post("/newMessageReceived", async (req, res) => {
    const messageData = req.body;
    try {
      // Emitir el evento desde app con los datos recibidos
      io.emit('NEW_MESSAGE_RECEIVED', messageData);
      console.log(`Evento 'NEW_MESSAGE_RECEIVED' emitido con datos:`, messageData);
      res.status(200).send("Evento emitido con éxito");
    } catch (error) {
      console.error("Error al emitir el evento desde app:", error);
      res.status(500).send("Error al emitir el evento");
    }
  });


  if (!userId) {
    //console.error("userId is undefined or null");
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
  //console.log('body:',  req.body);
  
  const { chatId, message, UserId } = req.body;
  //console.log('en app', UserId);
  
  
  try {
    const response = await enviarRespuestaManual(chatId, message, UserId);
    if (response.success) {
      //io.emit('newMessage', { chatId, message, UserId });
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

module.exports = {app, server};
