document.addEventListener("DOMContentLoaded", carregaFranquias);
const urlFornecedor = "http://localhost:3000/fornecedores";
const urlBaseFranquia = "http://localhost:3000/franquias";

const btnCadastroFranquia = document.getElementById("btn-franquia-cadastro");
btnCadastroFranquia.addEventListener("click", clickBtnCadastroFranquia);

const btnCancelarFranquia = document.getElementById("btn-franquia-cancelar");
btnCancelarFranquia.addEventListener("click", cancelarEdicaoFranquia);

const inputNomeFranquia = document.getElementById("input-franquia-nome");
const inputEnderecoFranquia = document.getElementById("input-franquia-endereco");
const selectFornecedorFranquia = document.getElementById("select-franquia-fornecedor");

const selectFornecedor = document.getElementById("select-franquia-fornecedor");

const tbodyFranquia = document.getElementById("tbody-franquia");

let fornecedorIdNome = [];
let franquias = [];
let editandoFranquia = false;
let idFranquiaAtualizar;

function carregaFranquiaFornecedor() {
  fornecedorIdNome = [];
  limparSelectFornecedor();

  fetch(urlFornecedor, { method: "GET"})
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else
    {
      data.forEach((fornecedor) => {
        fornecedorIdNome.push(fornecedor);
        adicionaFornecedor(fornecedor);
      });
    }
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar fornecedores. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function adicionaFornecedor(fornecedor) {
  let option = document.createElement("option");

  option.value = fornecedor.id;
  option.textContent = fornecedor.nome;

  selectFornecedor.appendChild(option);
}

function limparSelectFornecedor() {
  selectFornecedor.innerHTML = `<option id="option-franquia-fornecedor" value="none" disabled selected>Selecione uma opção</option>`;
}

function carregaFranquias() {
  carregaFranquiaFornecedor();

  franquias = [];
  tbodyFranquia.innerHTML = "";

  fetch(urlBaseFranquia, { method: "GET"})
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    data.forEach((franquia) => {
      franquias.push(franquia);
      criarLinhaFranquia(franquia);
    })
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar as franquias. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function criarLinhaFranquia(franquia) {
  let tr = document.createElement("tr");
  tr.id = `tr-franquia-${franquia.id}`;

  tr.innerHTML =
` <td>${franquia.id}</td>
  <td>${franquia.nome}</td>
  <td>${franquia.endereco}</td>
  <td>${franquia.id_fornecedor}</td>
  <td class="td-buttons">
  <button class="btn btn-outline-success" id="btn-update" onclick="editarFranquia(${franquia.id})">Alterar</button>
  <button class="btn btn-outline-danger" id="btn-delete" onclick="deletarFranquia(${franquia.id})">Remover</button>
  </td>`;

  tbodyFranquia.appendChild(tr);
}

function editarFranquia(id) {
  editandoFranquia = true;
  idFranquiaAtualizar = id;

  let franquia = franquias.find((f) => f.id === id);

  inputNomeFranquia.value = franquia.nome;
  inputEnderecoFranquia.value = franquia.endereco;
  selectFornecedorFranquia.value = franquia.id_fornecedor;

  btnCadastroFranquia.innerText = "Atualizar";
  btnCancelarFranquia.style.display = "inline-block";
}

function deletarFranquia(id) {
  fetch(`${urlBaseFranquia}/${id}`, { method: "DELETE" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else
      removerFranquiaDaTela(id);
  })
  .catch((err) => {
    alert("Ocorreu um erro ao deletar a franquia. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function removerFranquiaDaTela(id) {
  document.getElementById(`tr-franquia-${id}`).remove();
  franquias = franquias.filter((franquia) => franquia.id !== id);
}

function clickBtnCadastroFranquia() {
  let nome = inputNomeFranquia.value;
  let endereco = inputEnderecoFranquia.value;
  let fornecedor = selectFornecedorFranquia.value;

  if (!nome || !endereco || fornecedor === "none") {
    alert("Preencha todos os campos!");
    return;
  }

  let franquia = {
    id: idFranquiaAtualizar,
    nome: nome,
    endereco: endereco,
    fornecedor: fornecedor
  }

  if (editandoFranquia)
    atualizarFranquia(franquia);
  else
    inserirFranquia(franquia);
}

function atualizarFranquia(franquia) {
  fetch(`${urlBaseFranquia}/${idFranquiaAtualizar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(franquia)
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
  
    editandoFranquia = false;
    
    btnCadastroFranquia.innerText = "Cadastrar";
    btnCancelarFranquia.style.display = "none";

    limparInputsFranquia();
    limparSelectFranquia();
    carregaFranquias();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao atualizar a franquia. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function inserirFranquia(franquia) {
  fetch(urlBaseFranquia, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(franquia) 
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    limparInputsFranquia();
    limparSelectFranquia();
    carregaFranquias();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao inserir a franquia. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function cancelarEdicaoFranquia() {
  editandoFranquia = false;

  btnCadastroFranquia.innerText = "Cadastrar";
  btnCancelarFranquia.style.display = "none";
  
  limparInputsFranquia();
  limparSelectFranquia();
}

function limparInputsFranquia() {
  inputNomeFranquia.value = "";
  inputEnderecoFranquia.value = "";
}

function limparSelectFranquia() {
  selectFornecedorFranquia.value = "";
  
  let optionFranquia = document.getElementById("option-franquia-fornecedor");

  optionFranquia.disabled = true;
  optionFranquia.selected = true;
}