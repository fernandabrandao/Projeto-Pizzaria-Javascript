document.addEventListener("DOMContentLoaded", carregaTiposIngredientes);
const urlBaseTipoIngrediente = "http://localhost:3000/tipos";

const btnCadastroTipoIngrediente = document.getElementById("btn-tipo-ingrediente-cadastro");
btnCadastroTipoIngrediente.addEventListener("click", clickBtnCadastroTipoIngrediente);

const btnCancelarTipoIngrediente = document.getElementById("btn-tipo-ingrediente-cancelar");
btnCancelarTipoIngrediente.addEventListener("click", cancelarEdicaoTipoIngrediente);

const inputNomeTipoIngrediente = document.getElementById("input-tipo-ingrediente-nome");

const tbodyTipoIngrediente = document.getElementById("tbody-tipo-ingrediente");

let tiposIngredientes = [];
let editandoTipoIngrediente = false;
let idTipoIngredienteAtualizar;

function carregaTiposIngredientes() {
  tiposIngredientes = [];
  tbodyTipoIngrediente.innerHTML = "";

  fetch(urlBaseTipoIngrediente, { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    data.forEach((tipoIngrediente) => {
      tiposIngredientes.push(tipoIngrediente);
      criarLinhaTipoIngrediente(tipoIngrediente);
    });
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar os tipos de ingredientes. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function criarLinhaTipoIngrediente(tipoIngrediente) {
  let tr = document.createElement("tr");
  tr.id = `tr-tipo-ingrediente-${tipoIngrediente.id}`;

  tr.innerHTML =
  `
    <td>${tipoIngrediente.id}</td>
    <td>${tipoIngrediente.nome}</td>
    <td class="td-buttons">
      <button class="btn btn-outline-success" id="btn-update" onclick="editarTipoIngrediente(${tipoIngrediente.id})">Alterar</button>
      <button class="btn btn-outline-danger" id="btn-delete" onclick="deletarTipoIngrediente(${tipoIngrediente.id})">Remover</button>
    </td>
  `;

  tbodyTipoIngrediente.appendChild(tr);
}

function editarTipoIngrediente(id) {
  editandoTipoIngrediente = true;
  idTipoIngredienteAtualizar = id;

  let tipoIngrediente = tiposIngredientes.find((tipo) => tipo.id === id);

  inputNomeTipoIngrediente.value = tipoIngrediente.nome;

  btnCancelarTipoIngrediente.style.display = "inline-block";
  btnCadastroTipoIngrediente.innerText = "Atualizar";
}

function deletarTipoIngrediente(id) {
  fetch(`${urlBaseTipoIngrediente}/${id}`, { method: "DELETE" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else
      removerTipoIngredienteDaTela(id);
  })
  .catch((err) => {
    alert("Ocorreu um erro ao deletar o tipo de ingrediente. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function removerTipoIngredienteDaTela(id) {
  document.getElementById(`tr-tipo-ingrediente-${id}`).remove();
  tiposIngredientes = tiposIngredientes.filter((tipo) => tipo.id !== id);
}

function clickBtnCadastroTipoIngrediente() {
  let nome = inputNomeTipoIngrediente.value;

  if (!nome) {
    alert("Preencha todos os campos!");
    return;
  }

  let tipoIngrediente = {
    id: idTipoIngredienteAtualizar,
    nome: nome
  }

  if (editandoTipoIngrediente)
    atualizarTipoIngrediente(tipoIngrediente);
  else 
    inserirTipoIngrediente(tipoIngrediente);
}

function atualizarTipoIngrediente(tipoIngrediente) {
  fetch(`${urlBaseTipoIngrediente}/${idTipoIngredienteAtualizar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tipoIngrediente)
  })
  .then((response) => response.json())
  .then((data) => { 
    if (data.error)
      throw new Error(data.error);
  
    editandoTipoIngrediente = false;
    
    btnCancelarTipoIngrediente.style.display = "none";
    btnCadastroTipoIngrediente.innerText = "Cadastrar";

    limparInputsTipoIngrediente();
    carregaTiposIngredientes();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao atualizar o tipo de ingrediente. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function inserirTipoIngrediente(tipoIngrediente) {
  fetch(urlBaseTipoIngrediente, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(tipoIngrediente)
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    limparInputsTipoIngrediente();
    carregaTiposIngredientes();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao inserir o tipo de ingrediente. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function cancelarEdicaoTipoIngrediente() {
  editandoTipoIngrediente = false;

  btnCadastroTipoIngrediente.innerText = "Cadastrar";
  btnCancelarTipoIngrediente.style.display = "none";

  limparInputsTipoIngrediente();
}

function limparInputsTipoIngrediente() {
  inputNomeTipoIngrediente.value = "";
}