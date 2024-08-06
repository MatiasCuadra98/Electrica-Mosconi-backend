const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const routes = require("./newRoutes");
const https = require("https");
const { Server } = require("socket.io");
const { User } = require("./db");
const { enviarRespuestaManual } = require('./telegramBot/telegramBot'); 
require('dotenv').config();


const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

const server = express();
const app = https.createServer(server);

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

server.post('/telegram/sendMessage', async (req, res) => {
  const { chatId, message, userId } = req.body;
  try {
    const response = await enviarRespuestaManual(chatId, message, userId);
    if (response.success) {
      res.status(200).send(response.message);
    } else {
      res.status(500).send(response.message);
    }
  } catch (error) {
    res.status(500).send('Error al enviar el mensaje: ' + error.message);
  }
});

server.get("/webhook",(req,res)=>{
  let mode=req.query["hub.mode"];
  let challange=req.query["hub.challenge"];
  let token=req.query["hub.verify_token"];


   if(mode && token){

       if(mode==="subscribe" && token===mytoken){
           res.status(200).send(challange);
       }else{
           res.status(403);
       }

   }

});

server.post("/webhook",(req,res)=>{ //i want some 

  let body_param=req.body;

  console.log(JSON.stringify(body_param,null,2));

  if(body_param.object){
      console.log("inside body param");
      if(body_param.entry && 
          body_param.entry[0].changes && 
          body_param.entry[0].changes[0].value.messages && 
          body_param.entry[0].changes[0].value.messages[0]  
          ){
             let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
             let from = body_param.entry[0].changes[0].value.messages[0].from; 
             let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

             console.log("phone number "+phon_no_id);
             console.log("from "+from);
             console.log("boady param "+msg_body);

             axios({
                 method:"POST",
                 url:"https://graph.facebook.com/v13.0/"+phon_no_id+"/messages?access_token="+token,
                 data:{
                     messaging_product:"whatsapp",
                     to:from,
                     text:{
                         body:"Hi.. I'm Prasath, your message is "+msg_body
                     }
                 },
                 headers:{
                     "Content-Type":"application/json"
                 }

             });

             res.sendStatus(200);
          }else{
              res.sendStatus(404);
          }

  }

});

server.get("/",(req,res)=>{
  res.status(200).send("hello this is webhook setup");
});

server.use("/", routes(io));

module.exports = app;
