import "dotenv/config";
import express from "express";
import sendEmail from "./mailer/mailer.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import cors from "cors";
import {
  isValidEmail,
  isValidMessage,
  isValidName,
  isValidPhoneNumber,
} from "./utils/inputValidation.js";
import dbConn from "./model/contacts.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));

// SERVER/SOCKET
const PORT = process.env.PORT || 3600;
const expressServer = app.listen(PORT, () =>
  console.log(`App running on http://localhost:${PORT}`)
);
export const io = new Server(expressServer);

// Helper Functions
function html(info) {
  return `
  <div class="container" style="font-family: Arial, sans-serif; background-color: #f5f5f5; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
  <h2 style="color: #333; padding: 20px 0; margin-bottom: 30px;">Portfolio Contact</h2>
  <div class="info" style="padding: 0 20px; color: #555;">
    <p style="margin-bottom: 10px;"><strong>Name:</strong> ${info.name}</p>
    <p style="margin-bottom: 10px;"><strong>Email:</strong> ${info.email}</p>
    <p style="margin-bottom: 10px;"><strong>Phone:</strong> ${info.phone}</p>
    <p style="margin-bottom: 20px;">${info.message}</p>
    <p style="margin-bottom: 10px;"><strong>Date/Time:</strong> ${info.dateInserted}</p>
  </div>
</div>
  `;
}

// Socket Events
io.on("connection", (socket) => {
  console.log(`Connected : ${socket.id}`);
  io.emit("clients", { name: "Oluegwu" });

  socket.on("clients", (data) => console.log(data));
});

app.get("/", (req, res) => {
  return res.json({ success: true, message: "Your Server is running" });
});

app.post("/contact", async (req, res) => {
  const { name, phone, email, message } = req.body;

  const doc = {
    name,
    phone,
    email,
    message,
    dateInserted: `${new Date().toDateString()}: ${new Date().toLocaleTimeString()}`,
  };

  // Email Info
  const emailInfo = {
    to: "ocaictcentre@gmail.com",
    subject: "Portfolio Contact",
    text: email,
    html: html(doc),
  };
  console.log({
    email: isValidEmail(email),
    phone: isValidPhoneNumber(phone),
    name: isValidName(name),
    message: isValidMessage(message),
  });
  if (
    !isValidEmail(email) ||
    !isValidPhoneNumber(phone) ||
    !isValidName(name) ||
    !isValidMessage(message)
  )
    return res
      .status(400)
      .send({ success: false, message: "One or more fields are invalid" });

  try {
    const contacts = await dbConn();
    const foundContact = await contacts.findOne({ email });
    if (foundContact)
      return res
        .status(400)
        .send({ success: false, message: "You have already sent a message" });
    const result = await contacts.insertOne(doc);
    const emailResult = await sendEmail(emailInfo);
    // const message = await sendSMS({
    //   text: `${name} with the number ${phone} filled out your portfolio contact form`,
    // });

    return res.status(201).send({ success: true, user: { name, email } });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error occured from the server. Please try again",
    });
  }
});

app.all("*", (req, res) => {
  res.send({ message: "We are developing..." });
});
