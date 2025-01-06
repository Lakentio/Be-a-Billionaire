// script.js

let balance = 100000000000; // Saldo inicial
let cart = []; // Carrinho de compras

const items = [
  { name: "Big Mac", price: 5, img: "assets/bigmac.png" },
  { name: "iPhone 16", price: 1200, img: "assets/iphone.webp" },
  { name: "Tesla Model 3", price: 35000, img: "assets/tesla.png" },
  { name: "Private Island", price: 30000000, img: "assets/island.jpg" }
];

// Inicializa a página
function init() {
  const savedBalance = localStorage.getItem("balance");
  const savedCart = localStorage.getItem("cart");

  if (savedBalance) balance = parseInt(savedBalance);
  if (savedCart) cart = JSON.parse(savedCart);

  // Nova funcionalidade para selecionar o bilionário baseado na URL
  const urlParams = new URLSearchParams(window.location.search);
  const billionaire = urlParams.get('billionaire');
  if (billionaire) {
    const select = document.querySelector(".billionaire");
    select.value = billionaire; // Seleciona o bilionário na lista
    changeBillionaire(); // Atualiza o saldo e o carrinho
  }

  updateBalance();
  renderItems();
  renderCart();
}

function renderItems() {
    const itemList = document.getElementById("item-list");
    itemList.innerHTML = "";
    items.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("item");
      itemDiv.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <p>${item.name} - $${item.price.toLocaleString()}</p>
        <div class="button-container">
          <button class="buy-button" onclick="buyItem('${item.name}', ${item.price})">Buy</button>
          <button class="sell-button" onclick="sellItem('${item.name}')">Sell</button>
        </div>
      `;
      itemList.appendChild(itemDiv);
    });
  }
  

function buyItem(name, price) {
  if (balance >= price) {
    balance -= price;
    const itemIndex = cart.findIndex(item => item.name === name);
    if (itemIndex !== -1) {
      cart[itemIndex].quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }
    saveData();
    updateBalance();
    renderCart();
    showFeedback(`${name} added to your cart!`);
  } else {
    alert("Not enough money!");
  }
}

function sellItem(name) {
    const itemIndex = cart.findIndex(item => item.name === name);
    
    if (itemIndex !== -1) {
      const item = cart[itemIndex];
      balance += item.price; // Adiciona o valor do item ao saldo
      cart.splice(itemIndex, 1); // Remove o item do carrinho
      saveData(); // Salva os dados atualizados no localStorage
      updateBalance(); // Atualiza o saldo na interface
      renderCart(); // Atualiza a lista de itens no carrinho
      showFeedback(`${name} sold for $${item.price.toLocaleString()}!`);
    } else {
      alert("Item not found in cart!");
    }
  }  

function updateBalance() {
  document.getElementById("balance").textContent = `Balance: $${balance.toLocaleString()}`;
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    cartItems.innerHTML = "";
    let total = 0;
  
    cart.forEach(item => {
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}
        <button class="sell-button" onclick="sellItem('${item.name}')">Sell</button>
      `;
      cartItems.appendChild(listItem);
      total += item.price * item.quantity;
    });
  
    cartTotal.textContent = `Total Spent: $${total.toLocaleString()}`;
  }
  

function showFeedback(message) {
  const feedback = document.createElement("div");
  feedback.textContent = message;
  feedback.style.backgroundColor = "#4CAF50";
  feedback.style.color = "white";
  feedback.style.padding = "10px";
  feedback.style.position = "fixed";
  feedback.style.bottom = "20px";
  feedback.style.right = "20px";
  feedback.style.borderRadius = "8px";
  document.body.appendChild(feedback);

  setTimeout(() => feedback.remove(), 3000);
}

function changeBillionaire() {
  const select = document.querySelector(".billionaire");
  const value = select.value;

  switch (value) {
    case "elon_musk":
      balance = 250000000000;
      break;
    case "jeff_bezos":
      balance = 150000000000;
      break;
    default:
      balance = 100000000000;
  }

  cart = []; // Reseta o carrinho
  saveData();
  updateBalance();
  renderCart();
}

function clearCart() {
  const select = document.querySelector(".billionaire");
  const value = select.value;

  switch (value) {
    case "elon_musk":
      balance = 250000000000;
      break;
    case "jeff_bezos":
      balance = 150000000000;
      break;
    default:
      balance = 100000000000;
  }

  cart = [];
  saveData();
  updateBalance();
  renderCart();
  showFeedback("Cart cleared and balance restored!");
}

function saveData() {
  localStorage.setItem("balance", balance);
  localStorage.setItem("cart", JSON.stringify(cart));
}

init();

