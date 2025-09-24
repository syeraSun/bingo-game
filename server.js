const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const PORT = process.env.PORT || 3000;

// Serve static frontend files from "public" folder
app.use(express.static("public"));

// Default route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A player connected");

  socket.on("disconnect", () => {
    console.log("A player disconnected");
  });
});

// Start server
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
