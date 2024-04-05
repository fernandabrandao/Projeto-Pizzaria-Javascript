document.addEventListener("DOMContentLoaded", carregaFornecedores);
const urlBaseFornecedor = "http://localhost:3000/fornecedores";

const btnCadastroFornecedor = document.getElementById("btn-fornecedor-cadastro");
btnCadastroFornecedor.addEventListener("click", clickBtnCadastroFornecedor);

const btnCancelarFornecedor = document.getElementById("btn-fornecedor-cancelar");
btnCancelarFornecedor.addEventListener("click", cancelarEdicaoFornecedor);

const inputNomeFornecedor = document.getElementById("input-fornecedor-nome");
const inputCnpjFornecedor = document.getElementById("input-fornecedor-cnpj");
const inputTelefoneFornecedor = document.getElementById("input-fornecedor-telefone");
const inputEmailFornecedor = document.getElementById("input-fornecedor-email");

const tbodyFornecedor = document.getElementById("tbody-fornecedor");

let fornecedores = [];
let editandoFornecedor = false;
let idFornecedorAtualizar;

function carregaFornecedores() {
  fornecedores = [];
  tbodyFornecedor.innerHTML = "";

  fetch(urlBaseFornecedor, { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    data.forEach(fornecedor => {
      fornecedores.push(fornecedor);
      criarLinhaFornecedor(fornecedor);
    });
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar os fornecedores. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function criarLinhaFornecedor(fornecedor) {
  let tr = document.createElement("tr");
  tr.id = `tr-fornecedor-${fornecedor.id}`;

  tr.innerHTML =
    `
    <td>${fornecedor.id}</td>
    <td>${fornecedor.nome}</td>
    <td>${fornecedor.cnpj}</td>
    <td>${fornecedor.telefone}</td>
    <td>${fornecedor.email}</td>
    <td class="td-buttons">
      <button class="btn btn-outline-success" id="btn-update" onclick="editarFornecedor(${fornecedor.id})">Alterar</button>
      <button class="btn btn-outline-danger" id="btn-delete" onclick="deletarFornecedor(${fornecedor.id})">Remover</button>
    </td>
    `;

  tbodyFornecedor.appendChild(tr);
}

function editarFornecedor(id) {
  editandoFornecedor = true;
  idFornecedorAtualizar = id;

  let fornecedor = fornecedores.find(f => f.id === id);

  inputNomeFornecedor.value = fornecedor.nome;
  inputCnpjFornecedor.value = fornecedor.cnpj;
  inputTelefoneFornecedor.value = fornecedor.telefone;
  inputEmailFornecedor.value = fornecedor.email;

  btnCancelarFornecedor.style.display = "inline-block";
  btnCadastroFornecedor.innerText = "Atualizar";
}

function deletarFornecedor(id) {
  fetch(`${urlBaseFornecedor}/${id}`, { method: "DELETE" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else
      removerFornecedorDaTela(id);
  })
  .catch((err) => {
    alert("Ocorreu um erro ao deletar o fornecedor. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function removerFornecedorDaTela(id) {
  document.getElementById(`tr-fornecedor-${id}`).remove();
  fornecedores = fornecedores.filter(fornecedor => fornecedor.id !== id);
}

function clickBtnCadastroFornecedor() {
  let nome = inputNomeFornecedor.value;
  let cnpj = inputCnpjFornecedor.value;
  let telefone = inputTelefoneFornecedor.value;
  let email = inputEmailFornecedor.value;

  if (!nome || !cnpj || !telefone || !email) {
    alert("Preencha todos os campos!");
    return;
  }

  let fornecedor = {
    id: idFornecedorAtualizar,
    nome: nome,
    cnpj: cnpj,
    telefone: telefone,
    email: email
  }

  if (editandoFornecedor)
    atualizarFornecedor(fornecedor);
  else
    inserirFornecedor(fornecedor);
}

function atualizarFornecedor(fornecedor) {
  fetch(`${urlBaseFornecedor}/${idFornecedorAtualizar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(fornecedor)
  })
  .then((response) => response.json())
  .then((data) => { 
    if (data.error)
      throw new Error(data.error);
  
    editandoFornecedor = false;
    
    btnCancelarFornecedor.style.display = "none";
    btnCadastroFornecedor.innerText = "Cadastrar";

    limparInputsFornecedor();
    carregaFornecedores();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao atualizar o fornecedor. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function inserirFornecedor(fornecedor) {
  fetch(urlBaseFornecedor, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(fornecedor)
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    limparInputsFornecedor();
    carregaFornecedores();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao inserir o fornecedor. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function cancelarEdicaoFornecedor() {
  editandoFornecedor = false;
  
  btnCadastroFornecedor.innerText = "Cadastrar";
  btnCancelarFornecedor.style.display = "none";

  limparInputsFornecedor();
}

function limparInputsFornecedor() {
  inputNomeFornecedor.value = "";
  inputCnpjFornecedor.value = "";
  inputTelefoneFornecedor.value = "";
  inputEmailFornecedor.value = "";
}