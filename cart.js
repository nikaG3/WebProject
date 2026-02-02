const hamMenuBtn = document.querySelector(".hamMenu")
const offScreen = document.querySelector(".offScreen")

hamMenuBtn.addEventListener("click", () => {
hamMenuBtn.classList.toggle("active")
offScreen.classList.toggle("active")
})

let cart = document.getElementById("cart");
let cartItems = [];

function renderCart() {
  cartItems.forEach((item) => (cart.innerHTML += cartList(item)));
}

function openCart() {
  fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    .then((pasuxi) => pasuxi.json())
    .then((data) => {
      cartItems = data;
      updateCartTotalPrice();
      renderCart();
    });
}

openCart();

function reLoadCart() {
  fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    .then((pasuxi) => pasuxi.json())
    .then((data) => {
      cartItems = data;
      updateCartTotalPrice();
    });
}

function cartList(item) {
  return `<li class="cart-item">
            <img src="${item.product.image}" alt="">
            <h3>${item.product.name}.</h3>
            <h3>Quantity: <button class="increase-btn" onclick="increase(${item.product.id})"> + </button> <span id="quantity-${item.product.id}">${item.quantity}</span> <button class="decrease-btn" onclick="decrease(${item.product.id} )"> - </button> </h3>
            <h3>Price: ${item.price}</h3>
            <h3>Total: <span id="total-${item.product.id}">${item.quantity * item.price}</span></h3>
            <button class="remove-btn" onclick="removeFromCart(${item.product.id})">X</button>
        </li>`;
}

function increase(id) {
  let item = cartItems.find((it) => it.product.id === id);
  item.quantity++;
  let info = {
    quantity: item.quantity,
    price: item.price,
    productId: item.product.id,
  };
  fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
    method: "PUT",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((pasuxi) => pasuxi.text())
    .then(() => {
      const quantityElement = document.getElementById(
        `quantity-${item.product.id}`,
      );
      quantityElement.innerHTML = item.quantity;
      const totalElement = document.getElementById(`total-${item.product.id}`);
      totalElement.innerHTML = item.quantity * item.price;
      reLoadCart();
    });
}

function decrease(id) {
  let item = cartItems.find((it) => it.product.id === id);
  if (item.quantity <= 1) {
    return;
  }
  item.quantity--;
  let info = {
    quantity: item.quantity,
    price: item.price,
    productId: item.product.id,
  };

  fetch("https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket", {
    method: "PUT",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(info),
  })
    .then((pasuxi) => pasuxi.text())
    .then(() => {
      const quantityElement = document.getElementById(
        `quantity-${item.product.id}`,
      );
      quantityElement.innerHTML = item.quantity;
      const totalElement = document.getElementById(`total-${item.product.id}`);
      totalElement.innerHTML = item.quantity * item.price;
      reLoadCart();
    });
}

function removeFromCart(id) {
  fetch(`https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${id}`, {
    method: "DELETE",
    headers: {
      accept: "*/*",
    },
  })
    .then((pasuxi) => pasuxi.text())
    .then(() => {
      cart.innerHTML = "";
      openCart();
      reLoadCart();
    });
}

function updateCartTotalPrice() {
  let total = 0;
  cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });
  document.getElementById("total-price").innerText = `Total Price: ${total}`;
}
function checkout() {
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  
  Promise.all(
    cartItems.map((item) =>
      fetch(
        `https://restaurant.stepprojects.ge/api/Baskets/DeleteProduct/${item.product.id}`,
        {
          method: "DELETE",
          headers: { accept: "*/*" },
        },
      ),
    ),
  ).then(() => {
    alert(`Thank you for your order! Total: $${total}`);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));

    
    cartItems = [];
    cart.innerHTML = "";
    updateCartTotalPrice();
  });
}

