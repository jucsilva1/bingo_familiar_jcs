let vetorJogadores = [];
let jogoRolando = false;
let intervaloSorteio = null;
let numerosSorteados = [];
let ganhadores = [];

function gerarNumeroAleatorio(inicio, fim) {
  return Math.floor((fim - inicio + 1) * Math.random()) + inicio;
}

function gerarFileira(qtd, inicio, fim) {
  let fileira = [];
  while (fileira.length < qtd) {
    let num = gerarNumeroAleatorio(inicio, fim);
    if (!fileira.includes(num)) fileira.push(num);
  }
  return fileira;
}

function gerarCartela() {
  return [
    gerarFileira(5, 1, 15),
    gerarFileira(5, 16, 30),
    gerarFileira(5, 31, 45),
    gerarFileira(5, 46, 60),
    gerarFileira(5, 61, 75),
  ];
}

function gerarCartelaHTML() {
  if (jogoRolando) {
    alert("Não é possível gerar cartela com o jogo em andamento!");
    return;
  }
  new bootstrap.Modal(document.getElementById("modalJogador")).show();
}

function confirmarNomeJogador() {
  const nome = document.getElementById("inputNomeJogador").value.trim();
  if (!/^[A-Za-zÀ-ÿ\s]{4,}$/.test(nome)) {
    alert("Nome inválido! Use pelo menos 4 letras.");
    return;
  }
  bootstrap.Modal.getInstance(document.getElementById("modalJogador")).hide();
  criarCartelaJogador(nome);
}

function criarCartelaJogador(nome) {
  const letras = ["B", "I", "N", "G", "O"];
  const cartela = gerarCartela();
  vetorJogadores.push({ nome, cartela });

  const divBingo = document.getElementById("bingo");
  const divCartela = document.createElement("div");
  divCartela.className = "col-4";

  const h3 = document.createElement("h3");
  h3.className = "text-center";
  h3.innerText = nome;
  divCartela.appendChild(h3);

  const table = document.createElement("table");
  table.className = "borda-tabela";

  const trTitulo = document.createElement("tr");
  letras.forEach((letra) => {
    const td = document.createElement("td");
    td.innerText = letra;
    trTitulo.appendChild(td);
  });
  table.appendChild(trTitulo);

  for (let i = 0; i < 5; i++) {
    const tr = document.createElement("tr");
    for (let j = 0; j < 5; j++) {
      const td = document.createElement("td");
      td.className = "borda-tabela";
      td.innerText = i === 2 && j === 2 ? "X" : cartela[j][i];
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }

  divCartela.appendChild(table);
  divBingo.appendChild(divCartela);
}

function verificaCartela(cartela, sorteados) {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (cartela[i][j] !== "X" && !sorteados.includes(cartela[i][j])) {
        return false;
      }
    }
  }
  return true;
}

function iniciarJogo() {
  if (vetorJogadores.length < 2) {
    alert("Você precisa ter pelo menos dois jogadores para iniciar!");
    return;
  }

  jogoRolando = true;
  document.getElementById("botaoGerarCartela").classList.add("disabled");
  alert(
    "Jogo iniciado! Agora você pode sortear números manualmente ou automaticamente."
  );
}

function sortearNumero() {
  if (!jogoRolando) return;
  let num;
  do {
    num = gerarNumeroAleatorio(1, 75);
  } while (numerosSorteados.includes(num));
  numerosSorteados.push(num);
  marcarNumero(num);
  verificarGanhadores();
}

function iniciarSorteioAutomatico() {
  if (!jogoRolando) {
    alert("Inicie o jogo primeiro!");
    return;
  }

  const qtd = parseInt(document.getElementById("quantidadeSorteios").value);
  let contador = 0;
  intervaloSorteio = setInterval(() => {
    if (contador >= qtd || numerosSorteados.length >= 75) {
      clearInterval(intervaloSorteio);
      return;
    }
    sortearNumero();
    contador++;
  }, 3000);
}

function pararSorteio() {
  clearInterval(intervaloSorteio);
}

function marcarNumero(numero) {
  const tds = document.getElementsByTagName("td");
  for (let td of tds) {
    if (parseInt(td.innerText) === numero) {
      td.style.backgroundColor = "green";
    }
  }

  const div = document.createElement("div");
  div.className = "col-2 sorteado";
  div.innerText = numero;
  document.getElementById("sorteados").appendChild(div);

  // Atualiza bola destacada no topo
  const bolaTopo = document.getElementById("bolaDestacada");
  bolaTopo.innerText = numero;
}

function verificarGanhadores() {
  vetorJogadores.forEach((jogador) => {
    if (
      !ganhadores.includes(jogador.nome) &&
      verificaCartela(jogador.cartela, numerosSorteados)
    ) {
      ganhadores.push(jogador.nome);
      document.getElementById(
        "vencedor"
      ).innerText = `${jogador.nome} ganhou o BINGO! 🎉`;
      pararSorteio();

      // Aguarda 500ms antes de exibir o confirm
      setTimeout(() => {
        if (!confirm("Deseja continuar para buscar outro ganhador?")) {
          jogoRolando = false;
          document
            .getElementById("botaoGerarCartela")
            .classList.remove("disabled");
        }
      }, 500);
    }
  });
}

function reiniciarJogo() {
  if (jogoRolando) {
    alert("Você não pode reiniciar o jogo enquanto ele está rolando!");
    return;
  }

  document.getElementById("vencedor").innerText = "";
  document.getElementById("sorteados").innerHTML = "";
  document.getElementById("bingo").innerHTML = "";
  vetorJogadores = [];
  numerosSorteados = [];
  ganhadores = [];
  document.getElementById("botaoGerarCartela").classList.remove("disabled");
}
