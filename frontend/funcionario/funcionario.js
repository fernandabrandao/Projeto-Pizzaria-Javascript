document.addEventListener("DOMContentLoaded", carregaFuncionarios);
const urlUsuario = "http://localhost:3000/usuarios";
const urlFranquia = "http://localhost:3000/franquias";
const urlBaseFuncionario = "http://localhost:3000/funcionarios";

const btnCadastroFuncionario = document.getElementById("btn-funcionario-cadastro");
btnCadastroFuncionario.addEventListener("click", clickBtnCadastroFuncionario);

const btnCancelarFuncionario = document.getElementById("btn-funcionario-cancelar");
btnCancelarFuncionario.addEventListener("click", cancelarEdicaoFuncionario);

const inputNomeFuncionario = document.getElementById("input-funcionario-nome");
const inputDataNascimentoFuncionario = document.getElementById("input-funcionario-data");
const inputEnderecoFuncionario = document.getElementById("input-funcionario-endereco");
const inputCpfFuncionario = document.getElementById("input-funcionario-cpf");
const inputEmailFuncionario = document.getElementById("input-funcionario-email");
const inputTelefoneFuncionario = document.getElementById("input-funcionario-telefone");
const selectUsuarioFuncionario = document.getElementById("select-funcionario-usuario");
const selectFranquiaFuncionario = document.getElementById("select-funcionario-franquia");

const selectFranquia = document.getElementById("select-funcionario-franquia");
const selectUsuario = document.getElementById("select-funcionario-usuario");

const tbodyFuncionario = document.getElementById("tbody-funcionario");

let franquiaIdNome = [];
let usuarioIdLogin = [];
let funcionarios = [];
let editandoFuncionario = false;
let idFuncionarioAtualizar;


function carregaFuncionarioUsuario() {
  usuarioIdLogin = [];
  limparSelectUsuario();

  fetch(urlUsuario, { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else {
      data.forEach((usuario) => {
        usuarioIdLogin.push(usuario);
        adicionaUsuario(usuario);
      })
    }
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar os usuários. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function adicionaUsuario(usuario) {
  let option = document.createElement("option");

  option.value = usuario.id;
  option.textContent = usuario.login;
  
  selectUsuario.appendChild(option);
}

function limparSelectUsuario() {
  selectUsuario.innerHTML = `<option id="option-funcionario-usuario" value="none" disabled selected>Selecione uma opção</option>`;
}

function carregaFuncionarioFranquia() {
  franquiaIdNome = [];
  limparSelectFranquia();

  fetch(urlFranquia, { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else {
      data.forEach((franquia) => {
        franquiaIdNome.push(franquia);
        adicionaFranquia(franquia);
      })
    }
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar as franquias. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function adicionaFranquia(franquia) {
  let option = document.createElement("option");

  option.value = franquia.id;
  option.textContent = franquia.nome;

  selectFranquia.appendChild(option);
}

function limparSelectFranquia() {
  selectFranquia.innerHTML = `<option id="option-funcionario-franquia" value="none" disabled selected>Selecione uma opção</option>`;
}

function carregaFuncionarios() {
  carregaFuncionarioUsuario();
  carregaFuncionarioFranquia();

  funcionarios = [];
  tbodyFuncionario.innerHTML = "";

  fetch(urlBaseFuncionario, { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    data.forEach((funcionario) => {
      let dataFormatada = funcionario.dt_nascimento.split("T")[0];
      funcionario.dt_nascimento = dataFormatada;

      funcionarios.push(funcionario);     
      criarLinhaFuncionario(funcionario);
    })
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar os funcionários. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function criarLinhaFuncionario(funcionario) {
  let tr = document.createElement("tr");
  tr.id = `tr-funcionario-${funcionario.id}`;

  tr.innerHTML =
` <td>${funcionario.id}</td>
  <td>${funcionario.nome}</td>
  <td>${funcionario.dt_nascimento}</td>
  <td>${funcionario.endereco}</td>
  <td>${funcionario.cpf}</td>
  <td>${funcionario.email}</td>
  <td>${funcionario.telefone}</td>
  <td>${funcionario.id_usuario}</td>
  <td>${funcionario.id_franquia}</td>
  <td class="td-buttons">
  <button class="btn btn-outline-success" id="btn-update" onclick="editarFuncionario(${funcionario.id})">Alterar</button>
  <button class="btn btn-outline-danger" id="btn-delete" onclick="deletarFuncionario(${funcionario.id})">Remover</button>
  </td>`

  tbodyFuncionario.appendChild(tr);
}

function editarFuncionario(id) {
  editandoFuncionario = true;
  idFuncionarioAtualizar = id;

  let funcionario = funcionarios.find((f) => f.id === id);

  inputNomeFuncionario.value = funcionario.nome;
  inputDataNascimentoFuncionario.value = funcionario.dt_nascimento;
  inputEnderecoFuncionario.value = funcionario.endereco;
  inputCpfFuncionario.value = funcionario.cpf;
  inputEmailFuncionario.value = funcionario.email;
  inputTelefoneFuncionario.value = funcionario.telefone;
  selectUsuarioFuncionario.value = funcionario.id_usuario;
  selectFranquiaFuncionario.value = funcionario.id_franquia;

  btnCadastroFuncionario.innerText = "Atualizar";
  btnCancelarFuncionario.style.display = "inline-block";
}

function deletarFuncionario(id) {
  fetch(`${urlBaseFuncionario}/${id}`, { method: "DELETE"})
  .then((response) => response.json())
  .then((data) => {
    if(data.error)
      throw new Error(data.error);
    else
      removerFuncionarioDaTela(id)
  })
  .catch((err) => {
    alert("Ocorreu um erro ao deletar o funcionário. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function removerFuncionarioDaTela(id) {
  document.getElementById(`tr-funcionario-${id}`).remove();
  funcionarios = funcionarios.filter((funcionario) => funcionario.id !== id);
}

function clickBtnCadastroFuncionario() {
  let nome = inputNomeFuncionario.value;
  let nascimento = inputDataNascimentoFuncionario.value;
  let endereco = inputEnderecoFuncionario.value;
  let cpf = inputCpfFuncionario.value;
  let email = inputEmailFuncionario.value;
  let telefone = inputTelefoneFuncionario.value;
  let usuario = selectUsuarioFuncionario.value;
  let franquia = selectFranquiaFuncionario.value;

  if (!nome || !nascimento || !endereco || !cpf || !email || !telefone || usuario === "none" || franquia === "none") {
    alert("Preencha todos os campos!");
    return;
  }

  let funcionario = {
    id: idFuncionarioAtualizar,
    nome: nome,
    nascimento: nascimento,
    endereco: endereco,
    cpf: cpf,
    email: email,
    telefone: telefone,
    usuario: usuario,
    franquia: franquia
  }

  if (editandoFuncionario)
    atualizarFuncionario(funcionario);
  else
    inserirFuncionario(funcionario);
}

function atualizarFuncionario(funcionario) {
  fetch(`${urlBaseFuncionario}/${idFuncionarioAtualizar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(funcionario)
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
  
    editandoFuncionario = false;

    btnCadastroFuncionario.innerText = "Cadastrar";
    btnCancelarFuncionario.style.display = "none";

    limparInputsFuncionario();
    limparSelectsFuncionario();
    carregaFuncionarios();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao atualizar o funcionário. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function inserirFuncionario(funcionario) {
  fetch(urlBaseFuncionario, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(funcionario) 
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    limparInputsFuncionario();
    limparSelectsFuncionario();
    carregaFuncionarios();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao inserir o funcionário. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function cancelarEdicaoFuncionario() {
  editandoFuncionario = false;

  btnCadastroFuncionario.innerText = "Cadastrar";
  btnCancelarFuncionario.style.display = "none";

  limparInputsFuncionario();
  limparSelectsFuncionario();
}

function limparInputsFuncionario() {
  inputNomeFuncionario.value = "";
  inputDataNascimentoFuncionario.value = "";
  inputEnderecoFuncionario.value = "";
  inputCpfFuncionario.value = "";
  inputEmailFuncionario.value = "";
  inputTelefoneFuncionario.value = "";
}

function limparSelectsFuncionario() {
  selectUsuarioFuncionario.value = "";
  selectFranquiaFuncionario.value = "";

  let optionFuncionarioUsuario = document.getElementById("option-funcionario-usuario");
  optionFuncionarioUsuario.disabled = true;
  optionFuncionarioUsuario.selected = true;

  let optionFuncionarioFranquia = document.getElementById("option-funcionario-franquia");
  optionFuncionarioFranquia.disabled = true;
  optionFuncionarioFranquia.selected = true;
}