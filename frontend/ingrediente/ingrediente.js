document.addEventListener("DOMContentLoaded", carregaIngredientes);
const urlTipo = "http://localhost:3000/tipos";
const urlBaseIngrediente = "http://localhost:3000/ingredientes";

const btnCadastroIngrediente = document.getElementById("btn-ingrediente-cadastro");
btnCadastroIngrediente.addEventListener("click", clickBtnCadastroIngrediente);

const btnCancelarIngrediente = document.getElementById("btn-ingrediente-cancelar");
btnCancelarIngrediente.addEventListener("click", cancelarEdicaoIngrediente);

const inputNomeIngrediente = document.getElementById("input-ingrediente-nome");
const selectTipoIngrediente = document.getElementById("select-ingrediente-tipo");
const selectTipo = document.getElementById("select-ingrediente-tipo");

const tbodyIngrediente = document.getElementById("tbody-ingrediente");

let tipoIdNome = [];
let ingredientes = [];
let editandoIngrediente = false;
let idIngredienteAtualizar;

function carregaIngredienteTipo() {
  tipoIdNome = [];
  limparSelectTipo();

  fetch(urlTipo, { method: "GET"})
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else
    {
      data.forEach((tipo) => {
        tipoIdNome.push(tipo);
        adicionaTipo(tipo);
      });
    }
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar tipos de ingredientes. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function adicionaTipo(tipo) {
  let option = document.createElement("option");

  option.value = tipo.id;
  option.textContent = tipo.nome;

  selectTipo.appendChild(option);
}

function limparSelectTipo() {
  selectTipo.innerHTML = `<option id="option-ingrediente-tipo" value="none" disabled selected>Selecione uma opção</option>`;
}

function carregaIngredientes() {
  carregaIngredienteTipo();

  ingredientes = [];
  tbodyIngrediente.innerHTML = "";

  fetch(urlBaseIngrediente, { method: "GET"})
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    data.forEach((ingrediente) => {
      ingredientes.push(ingrediente);
      criarLinhaIngrediente(ingrediente);
    })
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar os ingredientes. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function criarLinhaIngrediente(ingrediente) {
  let tr = document.createElement("tr");
  tr.id = `tr-ingrediente-${ingrediente.id}`;

  tr.innerHTML =
  `
  <td>${ingrediente.id}</td>
  <td>${ingrediente.nome}</td>
  <td>${ingrediente.id_tipo}</td>
  <td class="td-buttons">
  <button class="btn btn-outline-success" id="btn-update" onclick="editarIngrediente(${ingrediente.id})">Alterar</button>
  <button class="btn btn-outline-danger" id="btn-delete" onclick="deletarIngrediente(${ingrediente.id})">Remover</button>
  </td>
  `;

  tbodyIngrediente.appendChild(tr);
}

function editarIngrediente(id) {
  editandoIngrediente = true;
  idIngredienteAtualizar = id;

  let ingrediente = ingredientes.find((i) => i.id === id);

  inputNomeIngrediente.value = ingrediente.nome;
  selectTipoIngrediente.value = ingrediente.id_tipo;

  btnCadastroIngrediente.innerText = "Atualizar";
  btnCancelarIngrediente.style.display = "inline-block";
}

function deletarIngrediente(id) {
  fetch(`${urlBaseIngrediente}/${id}`, { method: "DELETE" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else
      removerIngredienteDaTela(id);
  })
  .catch((err) => {
    alert("Ocorreu um erro ao deletar o ingrediente. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function removerIngredienteDaTela(id) {
  document.getElementById(`tr-ingrediente-${id}`).remove();
  ingredientes = ingredientes.filter((ingrediente) => ingrediente.id !== id);
}

function clickBtnCadastroIngrediente() {
  let nome = inputNomeIngrediente.value;
  let tipo = selectTipoIngrediente.value;

  if (!nome  || tipo === "none") {
    alert("Preencha todos os campos!");
    return;
  }

  let ingrediente = {
    id: idIngredienteAtualizar,
    nome: nome,
    tipo: tipo
  }

  if (editandoIngrediente) {
    atualizarIngrediente(ingrediente);
  }

  else {
    inserirIngrediente(ingrediente);
  }
}

function atualizarIngrediente(ingrediente) {
  fetch(`${urlBaseIngrediente}/${idIngredienteAtualizar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(ingrediente)
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
  
    editandoIngrediente = false;
    
    btnCadastroIngrediente.innerText = "Cadastrar";
    btnCancelarIngrediente.style.display = "none";

    limparInputIngrediente();
    limparSelectIngrediente();
    carregaIngredientes();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao atualizar o ingrediente. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function inserirIngrediente(ingrediente) {
  fetch(urlBaseIngrediente, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(ingrediente) 
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    limparInputIngrediente();
    limparSelectIngrediente();
    carregaIngredientes();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao inserir o ingrediente. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function cancelarEdicaoIngrediente() {
  editandoIngrediente = false;

  btnCadastroIngrediente.innerText = "Cadastrar";
  btnCancelarIngrediente.style.display = "none";
  
  limparInputIngrediente();
  limparSelectIngrediente();
}

function limparInputIngrediente() {
  inputNomeIngrediente.value = "";
}

function limparSelectIngrediente() {
  selectTipoIngrediente.value = "";
  
  let optionIngrediente = document.getElementById("option-ingrediente-tipo");

  optionIngrediente.disabled = true;
  optionIngrediente.selected = true;
}