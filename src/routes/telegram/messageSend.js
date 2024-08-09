const { Router } = require("express");
const { MsgSent, MsgReceived, Business, Contacts } = require("../../db");
const bot = require("../../telegramBot/telegramBot");

const messageSend = Router();

module.exports = (io) => {
  messageSend.post("/messageSend", async (req, res) => {
    const { textMessage, chatId, userId } = req.body;
    try {
      const date = new Date();
      const hours = date.getHours().toString();
      const minutes = date.getMinutes().toString();
      const seconds = date.getSeconds().toString();

      const receivedMsg = await MsgReceived.findOne({ where: { chatId } });
      if (!receivedMsg) { return res.status(404).json({ error: "Message not found" });}
      
      const { name, fromData, BusinessId, ContactId } = receivedMsg;
    //   console.log('Received message details:', receivedMsg);
      const business = await Business.findByPk(BusinessId);
      if (!business) {return res.status(404).json({ message: "Business not found" });}
    //   console.log('Business details:', business);

      const contact = await Contacts.findOne({ where: { phone: chatId } }) || await Contacts.findByPk(ContactId);
      if (!contact) {return res.status(404).json({ message: "Contact not found" });}

      await bot.sendMessage(chatId, textMessage);

      const msgCreated = await MsgSent.create({
        name: name,
        toData: { app: "telegram", value: chatId },
        message: textMessage,
        chatId: chatId,
        timestamp: date,
        received : false
      });

      await msgCreated.setBusiness(business)
      await msgCreated.setContacts(contact)
      await msgCreated.addMsgReceived(receivedMsg)
      userId && msgCreated.setUser(userId)

      io.emit("message", {
        from: chatId,
        text: textMessage,
        name: name,
        timestamp: `${hours}:${minutes}:${seconds}`,
        sent: true,
      });

      await receivedMsg.update({ responded: true });
      res.status(201).json(msgCreated);
    } catch (error) {
      console.error('Error while sending message:', error);
      res.status(400).json(error.message);
    }

    res.status(200).end();
  });
  return messageSend;
};