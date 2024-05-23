const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./routes");
const http = require("http");
const { Server } = require("socket.io");
const { User, MsgReceived } = require("./db");
const bot = require("./telegramBot/telegramBot")
const path = require("path");

//const mime = require('mime');

//mime.define({'application/javascript': ['js'], 'text/css': ['css']});

const server = express();
const app = http.createServer(server);
const io = new Server(app, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
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
//server.use(express.static(path.join(__dirname, '/assets'), {
//   setHeaders: function (res, path) {
//     res.type(mime.getType(path))
//   }
// }))
//

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  await User.update({ socketId: socket.id }, { where: { id: userId } });
  console.log(`Cliente conectado ${socket.id}`);
  console.log(userId);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});




server.use("/", routes(io));

module.exports = app;
