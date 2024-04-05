document.addEventListener("DOMContentLoaded", carregaPizzas);
const urlBasePizza = "http://localhost:3000/pizzas";

const btnCadastroPizza = document.getElementById("btn-pizza-cadastro");
btnCadastroPizza.addEventListener("click", clickBtnCadastroPizza);

const btnCancelarPizza = document.getElementById("btn-pizza-cancelar");
btnCancelarPizza.addEventListener("click", cancelarEdicaoPizza);

const inputNomePizza = document.getElementById("input-pizza-nome");
const inputPrecoPizza = document.getElementById("input-pizza-preco");
const selectTamanhoPizza = document.getElementById("select-pizza-tamanho");

const tbodyPizza = document.getElementById("tbody-pizza");

let pizzas = [];
let editandoPizza = false;
let idPizzaAtualizar;

function carregaPizzas(){
  pizzas = [];
  tbodyPizza.innerHTML = "";

  fetch(urlBasePizza, { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    data.forEach(pizza => {
      pizzas.push(pizza);
      criarLinhaPizza(pizza);
    });
  })
  .catch((err) => {
    alert("Ocorreu um erro ao buscar as pizzas. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function criarLinhaPizza(pizza) {
  let tr = document.createElement("tr");
  tr.id = `tr-pizza-${pizza.id}`;

  tr.innerHTML =
  `
  <td>${pizza.id}</td>
  <td>${pizza.nome}</td>
  <td>${pizza.preco}</td>
  <td>${pizza.tamanho}</td>
  <td class="td-buttons">
    <button class="btn btn-outline-success" id="btn-update" onclick="editarPizza(${pizza.id})">Alterar</button>
    <button class="btn btn-outline-danger" id="btn-delete" onclick="deletarPizza(${pizza.id})">Remover</button>
  </td>
  `;

  tbodyPizza.appendChild(tr);
}

function editarPizza(id) {
  editandoPizza = true;
  idPizzaAtualizar = id;

  let pizza = pizzas.find(p => p.id === id);

  inputNomePizza.value = pizza.nome;
  inputPrecoPizza.value = pizza.preco;
  selectTamanhoPizza.value = pizza.tamanho;

  btnCancelarPizza.style.display = "inline-block";
  btnCadastroPizza.innerText = "Atualizar";
}

function deletarPizza(id) {
  fetch(`${urlBasePizza}/${id}`, { method: "DELETE" })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);
    else
      removerPizzaDaTela(id);
  })
  .catch((err) => {
    alert("Ocorreu um erro ao deletar a pizza. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function removerPizzaDaTela(id) {
  document.getElementById(`tr-pizza-${id}`).remove();
  pizzas = pizzas.filter((pizza) => pizza.id !== id);
}

function clickBtnCadastroPizza() {
  let nome = inputNomePizza.value;
  let preco = inputPrecoPizza.value;
  let tamanho = selectTamanhoPizza.value;

  if (!nome || !preco || !tamanho === "none") {
    alert("Preencha todos os campos!");
    return;
  }

  let pizza = {
    id: idPizzaAtualizar,
    nome: nome,
    preco: preco,
    tamanho: tamanho
  }

  if (editandoPizza)
    atualizarPizza(pizza);
  else
    inserirPizza(pizza);
}

function atualizarPizza(pizza) {
  fetch(`${urlBasePizza}/${idPizzaAtualizar}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(pizza)
  })
  .then((response) => response.json())
  .then((data) => { 
    if (data.error)
      throw new Error(data.error);
  
    editandoPizza = false;
    
    btnCancelarPizza.style.display = "none";
    btnCadastroPizza.innerText = "Cadastrar";

    limparInputsPizza();
    limparSelectPizza();
    carregaPizzas();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao atualizar o fornecedor. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function inserirPizza(pizza) {
  fetch(urlBasePizza, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(pizza)
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error)
      throw new Error(data.error);

    limparInputsPizza();
    limparSelectPizza();
    carregaPizzas();
  })
  .catch((err) => {
    alert("Ocorreu um erro ao inserir a pizza. Veja o console para mais informações.");
    console.error(err.message);
  });
}

function cancelarEdicaoPizza() {
  editandoPizza = false;
  
  btnCadastroPizza.innerText = "Cadastrar";
  btnCancelarPizza.style.display = "none";

  limparInputsPizza();
  limparSelectPizza();
}

function limparInputsPizza() {
  inputNomePizza.value = "";
  inputPrecoPizza.value = "";
}

function limparSelectPizza() {
  selectTamanhoPizza.value = "";

  let optionPizza = document.getElementById("option-pizza");

  optionPizza.disabled = true;
  optionPizza.selected = true;
}