document.addEventListener("DOMContentLoaded", carregaLotes);
const urlIngrediente = "http://localhost:3000/ingredientes";
const urlBaseLote = "http://localhost:3000/lotes";

const btnCadastroLote = document.getElementById("btn-lote-cadastro");
btnCadastroLote.addEventListener("click", clickBtnCadastroLote);

const btnCancelarLote = document.getElementById("btn-lote-cancelar");
btnCancelarLote.addEventListener("click", cancelarEdicaoLote);

const inputDataCompraLote = document.getElementById("input-lote-data-compra");
const inputDataValidadeLote = document.getElementById("input-lote-data-validade");
const inputQuantidadeLote = document.getElementById("input-lote-quantidade");
const inputPrecoLote = document.getElementById("input-lote-preco");
const selectIngredienteLote = document.getElementById("select-lote-ingrediente");

const selectIngrediente = document.getElementById("select-lote-ingrediente");

const tbodyLote = document.getElementById("tbody-lote");

let ingredienteIdNome = [];
let lotes = [];
let editandoLote = false;
let idLoteAtualizar;

function carregaLoteIngrediente() {
  ingredienteIdNome = [];
  limparSelectIngrediente();

  fetch(urlIngrediente, { method: "GET"})
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else
    {
      data.forEach((ingrediente) => {
        ingredienteIdNome.push(ingrediente);
        adicionaIngrediente(ingrediente);
      });
    }
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar ingredientes. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function adicionaIngrediente(ingrediente) {
  let option = document.createElement("option");

  option.value = ingrediente.id;
  option.textContent = ingrediente.nome;

  selectIngrediente.appendChild(option);
}

function limparSelectIngrediente() {
  selectIngrediente.innerHTML = `<option id="option-lote-ingrediente" value="none" disabled selected>Selecione uma opção</option>`;
}

function carregaLotes() {
  carregaLoteIngrediente();

  lotes = [];
  tbodyLote.innerHTML = "";

  fetch(urlBaseLote, { method: "GET"})
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    data.forEach((lote) => {
      let dataFormatadaDataCompra = lote.dt_compra.split("T")[0];
      let dataFormatadaDataValidade = lote.dt_validade.split("T")[0];

      lote.dt_compra = dataFormatadaDataCompra;
      lote.dt_validade = dataFormatadaDataValidade;

      lotes.push(lote);
      criarLinhaLote(lote);
    })
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar os lotes. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function criarLinhaLote(lote) {
  let tr = document.createElement("tr");
  tr.id = `tr-lote-${lote.id}`;
  
  tr.innerHTML =
  `
  <td>${lote.id}</td>
  <td>${lote.dt_compra}</td>
  <td>${lote.dt_validade}</td>
  <td>${lote.qtd}</td>
  <td>${lote.preco}</td>
  <td>${lote.id_ingredientes}</td>
  <td class="td-buttons">
  <button class="btn btn-outline-success" id="btn-update" onclick="editarLote(${lote.id})">Alterar</button>
  <button class="btn btn-outline-danger" id="btn-delete" onclick="deletarLote(${lote.id})">Remover</button>
  </td>
  `;

  tbodyLote.appendChild(tr);
}

function editarLote(id) {
  editandoLote = true;
  idLoteAtualizar = id;

  let lote = lotes.find((l) => l.id === id);

  inputDataCompraLote.value = lote.dt_compra;
  inputDataValidadeLote.value = lote.dt_validade;
  inputQuantidadeLote.value = lote.qtd;
  inputPrecoLote.value = lote.preco;
  selectIngredienteLote.value = lote.id_ingredientes;

  btnCadastroLote.innerText = "Atualizar";
  btnCancelarLote.style.display = "inline-block";
}

function deletarLote(id) {
  fetch(`${urlBaseLote}/${id}`, { method: "DELETE" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else
      removerLoteDaTela(id);
  })
  .catch((err) => {
    alert("Ocorreu um erro ao deletar o lote. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function removerLoteDaTela(id) {
  document.getElementById(`tr-lote-${id}`).remove();
  lotes = lotes.filter((lote) => lote.id !== id);
}

function clickBtnCadastroLote() {
  let compra = inputDataCompraLote.value;
  let validade = inputDataValidadeLote.value;
  let quantidade = inputQuantidadeLote.value;
  let preco = inputPrecoLote.value;
  let ingredientes = selectIngredienteLote.value;

  if (!compra || !validade || !quantidade || !preco || ingredientes === "none") {
    alert("Preencha todos os campos!");
    return;
  }

  let lote = {
    id: idLoteAtualizar,
    compra: compra,
    validade: validade,
    quantidade: quantidade,
    preco: preco,
    ingredientes: ingredientes
  }

  if (editandoLote)
    atualizarLote(lote);
  else
    inserirLote(lote);
}

function atualizarLote(lote) {
  fetch(`${urlBaseLote}/${idLoteAtualizar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(lote)
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
  
    editandoLote = false;
    
    btnCadastroLote.innerText = "Cadastrar";
    btnCancelarLote.style.display = "none";

    limparInputsLote();
    limparSelectLote();
    carregaLotes();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao atualizar o lote. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function inserirLote(lote) {
  fetch(urlBaseLote, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(lote) 
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    limparInputsLote();
    limparSelectLote();
    carregaLotes();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao inserir o lote. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function cancelarEdicaoLote() {
  editandoLote = false;

  btnCadastroLote.innerText = "Cadastrar";
  btnCancelarLote.style.display = "none";

  limparInputsLote();
  limparSelectLote();
}

function limparInputsLote() {
  inputDataCompraLote.value = "";
  inputDataValidadeLote.value = "";
  inputQuantidadeLote.value = "";
  inputPrecoLote.value = "";
}

function limparSelectLote() {
  selectIngredienteLote.value = "";

  let optionLote = document.getElementById("option-lote-ingrediente");

  optionLote.disabled = true;
  optionLote.selected = true;
}