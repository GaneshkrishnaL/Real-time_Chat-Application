require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const prisma = require("./utils/db");
const path = require("path");

const port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(path.join(__dirname, "../client/dist")));

// server test
app.get("/test", async (req, res) => {
  try {
    return res.status(200).json({ message: "hello world" });
  } catch (error) {
    throw new Error(error?.message);
  }
});

const server = require("http").createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("a user connected.");

  socket.on("send-message", async (payload) => {
    console.log(payload);
    const newMessage = await prisma.message.create({
      data: {
        from: payload?.from,
        chatId: payload?.chatId,
        text: payload?.text,
      },
    });
    io.sockets.emit("receive-message", newMessage);
  });
});

// routes
app.use("/auth", require("./routes/auth"));
app.use("/chats", require("./routes/chats"));
app.get("*", async (req, res) => {
  try {
    return res
      .status(200)
      .sendFile(path.join(__dirname, "../client/dist/index.html"));
  } catch (error) {
    return res.status(500).json({ error: error?.message });
  }
});

server.listen(port, () => console.log(`listening to app on port ${port}`));
