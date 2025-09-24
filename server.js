const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

let players = {};
let drawnNumbers = [];

function generateCard() {
  let numbers = [];
  while (numbers.length < 25) {
    let num = Math.floor(Math.random() * 75) + 1; // 1–75
    if (!numbers.includes(num)) numbers.push(num);
  }
  return numbers;
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Assign bingo card
  players[socket.id] = {
    card: generateCard(),
    marked: [],
  };
  socket.emit("card", players[socket.id].card);

  // Draw number (only host for now)
  socket.on("drawNumber", () => {
    let num;
    do {
      num = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.includes(num));

    drawnNumbers.push(num);
    io.emit("numberDrawn", num);
  });

  // Mark number
  socket.on("markNumber", (num) => {
    if (players[socket.id].card.includes(num)) {
      players[socket.id].marked.push(num);
      io.emit("marked", { player: socket.id, number: num });
    }
  });

  // Check Bingo
  socket.on("bingo", () => {
    io.emit("winner", socket.id);
    drawnNumbers = [];
    players = {};
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    delete players[socket.id];
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
