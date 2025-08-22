// Firebase SDK
const firebaseConfig = {
  apiKey: "AIzaSyBEhukcXqV6DR3ZJuMgR9szd7hBxg2ZLVM",
  authDomain: "bingo-senac-c22b0.firebaseapp.com",
  databaseURL: "https://bingo-senac-c22b0-default-rtdb.firebaseio.com",
  projectId: "bingo-senac-c22b0",
  storageBucket: "bingo-senac-c22b0.firebasestorage.app",
  messagingSenderId: "600466706954",
  appId: "1:600466706954:web:61a60808fb12b9071405f3",
  measurementId: "G-RPHQFB3D42"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ================= PLAYER =================
const card = document.getElementById("bingo-card");
const operationDisplay = document.getElementById("operation");

function generateCardNumbers() {
  const numbers = new Set();
  while (numbers.size < 24) {
    numbers.add(Math.floor(Math.random() * 60) + 1);
  }
  return Array.from(numbers);
}

function createBingoCard() {
  if (!card) return;
  const nums = generateCardNumbers();
  card.innerHTML = "";
  card.style.display = "grid";
  card.style.gridTemplateColumns = "repeat(5, 60px)";
  card.style.gridGap = "5px";

  for (let i = 0; i < 25; i++) {
    const square = document.createElement("div");
    square.classList.add("square");

    if (i === 12) { // centro LIVRE
      square.textContent = "LIVRE";
      square.classList.add("free", "selected");
    } else {
      const num = nums.shift();
      square.textContent = num;
    }
    card.appendChild(square);
  }

  // marcar manualmente ao clicar
  card.addEventListener("click", (e) => {
    if (e.target.classList.contains("square") && !e.target.classList.contains("free")) {
      e.target.classList.toggle("selected");
    }
  });
}

// Escuta operações do host (mostra apenas)
if (card) {
  createBingoCard();

  db.ref("sorteios").on("child_added", (snapshot) => {
    const sorteio = snapshot.val();
    if (operationDisplay) {
      operationDisplay.textContent = "Operação: " + sorteio.operacao;
    }
  });
}

// ================= HOST =================
const btnSortear = document.getElementById("btn-sortear");
const ultimoNumero = document.getElementById("ultimo-numero");
const listaSorteados = document.getElementById("lista-sorteados");

// Limpa Firebase ao iniciar o host (nova partida)
if (btnSortear) {
  db.ref("sorteios").remove().then(() => {
    console.log("Firebase limpo para nova partida!");
  }).catch((err) => console.error("Erro ao limpar Firebase:", err));
}

// Sorteia operação matemática com resultado 1–60
function sortearOperacao() {
  let operacao, resultado;

  do {
    const a = Math.floor(Math.random() * 60) + 1;
    const b = Math.floor(Math.random() * 60) + 1;

    const opTipo = ["+", "-", "×"][Math.floor(Math.random() * 3)];

    switch(opTipo) {
      case "+":
        resultado = a + b;
        operacao = `${a} + ${b}`;
        break;
      case "-":
        resultado = a - b;
        operacao = `${a} - ${b}`;
        break;
      case "×":
        resultado = a * b;
        operacao = `${a} × ${b}`;
        break;
    }
  } while (!operacao || resultado < 1 || resultado > 60);

  db.ref("sorteios").push({
    operacao: operacao,
    resultado: resultado
  });

  return operacao;
}

// Host: botão sortear
if (btnSortear) {
  // limpa lista antiga do DOM
  if (listaSorteados) listaSorteados.innerHTML = "";

  btnSortear.addEventListener("click", () => {
    const operacao = sortearOperacao();
    if (ultimoNumero) {
      ultimoNumero.textContent = "Operação sorteada: " + operacao;
    }
  });

  db.ref("sorteios").on("child_added", (snapshot) => {
    const sorteio = snapshot.val();
    if (listaSorteados && sorteio && sorteio.operacao) {
      const span = document.createElement("span");
      span.textContent = sorteio.operacao + " ";
      listaSorteados.appendChild(span);
    }
  });
}
