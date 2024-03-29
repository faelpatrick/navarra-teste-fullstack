const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

//função para ordernar elementos
const ordenarelementos = (array) => {
  array.sort(this.compararElementos); //compara com base na requisição
  array.forEach((elemento) => (elemento.previsao_consumo = elemento.quantidade * 5));
  return array;
};
const compararElementos = async (a, b) => {
  const condicaoPagamentoRanking = { DIN: 5, 30: 4, R60: 3, 90: 2, 120: 1 };

  // Comparação por quantidade (50% de importância)
  if (a.quantidade !== b.quantidade) {
    return b.quantidade - a.quantidade;
  }

  // Comparação por condição de pagamento (30% de importância)
  if (condicaoPagamentoRanking[a.condicao_pagamento] !== condicaoPagamentoRanking[b.condicao_pagamento]) {
    return (condicaoPagamentoRanking[b.condicao_pagamento] || 0) - (condicaoPagamentoRanking[a.condicao_pagamento] || 0);
  }

  // Comparação por país "PORT" (20% de importância)
  if (a.pais === "PORT" && b.pais !== "PORT") {
    return -1;
  } else if (b.pais === "PORT" && a.pais !== "PORT") {
    return 1;
  }

  return 0; // Se todos os critérios forem iguais, mantém a ordem original
};

//Rotas

//Boas Vindas
app.get("/", (req, res) => {
  res.status(200).json({ message: "Bem vindo!" });
});

//Status 200 OK
app.get("/status", (req, res) => {
  res.status(200).json({ status: "Status 200 - OK" });
});

//Criar um endpoint POST que receba um array JSON (https://pastebin.pl/view/raw/8fced5f8) com
// os elementos de uma fila de espera e que retorne o número total de elementos do array recebido.
app.post("/total-elementos", (req, res) => {
  const array = req.body;
  const total = array.length;
  res.status(200).json({ "total de elementos": total });
});

// Rota 03.
/*Criar um endpoint POST que receba um array JSON com os elementos de uma fila de espera e que
retorne os elementos ordenados conforme as seguintes ponderações:

▪ 50% de importância: Ordenar os elementos pela maior quantidade.
▪ 30% de importância: Levar em consideração a melhor condição de pagamento,
com a ordem de prioridade seguindo a lógica: DIN > 30 > R60 > 90 > 120.
▪ 20% de importância: Dar prioridade aqueles com a designação "PORT".
o Além da ordenação, deve adicionar a cada elemento do array o atributo
“previsao_consumo” obtido através da multiplicação da quantidade pela constante 5.
• Consuma o seguinte URL (https://pastebin.pl/view/raw/8fced5f8) em forma de API e retorne os
mesmos dados.
*/

app.post("/ordenacao", async (req, res) => {
  let array = req.body;
  const elementosOrdenados = ordenarelementos(array);
  res.status(200).json(elementosOrdenados);
});

//Consumir API e retornar os dados ordenados
app.get("/consumir-api", async (req, res) => {
  try {
    const response = await axios.get("https://pastebin.pl/view/raw/8fced5f8");
    const elementosOrdenados = ordenarelementos(response.data);
    res.status(200).json(elementosOrdenados);
  } catch (error) {
    console.error("Ocorreu um erro:", error);
    return res.status(500).json({ error: "Dados não encontrados ou formato inválido." });
  }
});

// Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});
