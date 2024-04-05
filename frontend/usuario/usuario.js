document.addEventListener("DOMContentLoaded", carregaUsuarios);
const urlBaseUsuario = "http://localhost:3000/usuarios";

const btnCadastroUsuario = document.getElementById("btn-usuario-cadastro");
btnCadastroUsuario.addEventListener("click", clickBtnCadastroUsuario);

const btnCancelarUsuario = document.getElementById("btn-usuario-cancelar");
btnCancelarUsuario.addEventListener("click", cancelarEdicaoUsuario);



const inputEmailUsuario = document.getElementById("input-usuario-email");
const inputLoginUsuario = document.getElementById("input-usuario-login");
const inputSenhaUsuario = document.getElementById("input-usuario-senha");

const tbodyUsuario = document.getElementById("tbody-usuario");

let usuarios = [];
let editandoUsuario = false;
let idUsuarioAtualizar;

function carregaUsuarios() {
  usuarios = [];
  tbodyUsuario.innerHTML = "";

  fetch(urlBaseUsuario, { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    
    data.forEach(usuario => {
      usuarios.push(usuario);
      criarLinhaUsuario(usuario);
    });
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar os usuários. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function criarLinhaUsuario(usuario) {
  let tr = document.createElement("tr");
  tr.id = `tr-usuario-${usuario.id}`;

  tr.innerHTML = 
 `<td>${usuario.id}</td>
  <td>${usuario.email}</td>
  <td>${usuario.login}</td>
  <td>${usuario.senha}</td>
  <td class="td-buttons">
    <button class="btn btn-outline-success" id="btn-update" onclick="editarUsuario(${usuario.id})">Alterar</button>
    <button class="btn btn-outline-danger" id="btn-delete" onclick="deletarUsuario(${usuario.id})">Remover</button>
  </td>`;

  tbodyUsuario.appendChild(tr);
}

function editarUsuario(id) {
  editandoUsuario = true;
  idUsuarioAtualizar = id;

  let usuario = usuarios.find((u) => u.id === id);

  inputEmailUsuario.value = usuario.email;
  inputLoginUsuario.value = usuario.login;
  inputSenhaUsuario.value = usuario.senha;

  btnCadastroUsuario.innerText = "Atualizar";
  btnCancelarUsuario.style.display = "inline-block";
}

function deletarUsuario(id) {
  fetch(`${urlBaseUsuario}/${id}`, { method: "DELETE"})
  .then((response) => response.json())
  .then((data) => { 
    if (data.error)
      throw new Error(data.error);
    else
      removerUsuarioDaTela(id)
  })
  .catch((err) => {
    alert("Ocorreu um erro ao deletar o usuário. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function removerUsuarioDaTela(id) {
  document.getElementById(`tr-usuario-${id}`).remove();
  usuarios = usuarios.filter((usuario) => usuario.id !== id);
}

function clickBtnCadastroUsuario() {
  let email = inputEmailUsuario.value;
  let login = inputLoginUsuario.value;
  let senha = inputSenhaUsuario.value;

  if (!email || !login || !senha) {
    alert("Preencha todos os campos!");
    return;
  }

  let usuario = {
    id: idUsuarioAtualizar,
    email: email,
    login: login,
    senha: senha
  }

  if (editandoUsuario)
    atualizarUsuario(usuario);
  else
    inserirUsuario(usuario);
}

function atualizarUsuario(usuario) {
  fetch(`${urlBaseUsuario}/${idUsuarioAtualizar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(usuario)
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    editandoUsuario = false;

    btnCadastroUsuario.innerText = "Cadastrar";
    btnCancelarUsuario.style.display = "none";

    limparInputsUsuario();
    carregaUsuarios();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao atualizar o usuário. Veja o console para mais informações.");
    console.error(err.message);
  })
}

function inserirUsuario(usuario) {
  fetch(urlBaseUsuario, {
     method: "POST",
     headers: {
      "Content-Type": "application/json"
     },
     body: JSON.stringify(usuario)
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.error)
        throw new Error(data.error);

      limparInputsUsuario();
      carregaUsuarios();
    })
    .catch((err) => {
      alert("Ocorreu um erro ao inserir o usuário. Veja o console para mais informações.");
      console.error(err.message);
    })
}

function cancelarEdicaoUsuario() {
  editandoUsuario = false;

  limparInputsUsuario();

  btnCadastroUsuario.innerText = "Cadastrar";
  btnCancelarUsuario.style.display = "none";
}

function limparInputsUsuario() {
  inputEmailUsuario.value = "";
  inputLoginUsuario.value = "";
  inputSenhaUsuario.value = "";
}