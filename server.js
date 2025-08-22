const express = require("express");
const path = require("path");
const app = express();
const PORT = 3000;

// Pasta pública
app.use(express.static(path.join(__dirname, "public")));

// Rota principal (opcional)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "host.html"));
});

// Abrir host
app.get("/host", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "host.html"));
});

// Abrir player
app.get("/player", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "player.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
