const urlBase = "http://localhost:3000/login";

const btnEntrar = document.getElementById("btn-index-login");
btnEntrar.addEventListener('click', clickBtnEntrar);

const inputLogin = document.getElementById("input-index-login");
const inputSenha = document.getElementById("input-index-senha");

function clickBtnEntrar() {
  let login = inputLogin.value;
  let senha = inputSenha.value;

  let loginAdmin = {
    "login": login,
    "senha": senha
  }

  if (!inputLogin.value || !inputSenha.value)
    alert("Preencha todos os campos!");
  else
    validarLogin(loginAdmin);
}

function validarLogin(loginAdmin) {
  fetch(urlBase, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(loginAdmin)
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      alert("Login e senha inválidos");
    else
      window.location.href = "saudacao.html";
  })
  .catch(err => {
    alert("Um erro ocorreu na requisição. Veja o console para mais informações.");
    console.error(err.message);
  });
}