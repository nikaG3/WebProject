let historylist = document.querySelector(".orderHistory");
let cartItems = [];

let section = document.querySelector("section");

fetch("https://api.everrest.educata.dev/auth", {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${Cookies.get("user")}`
    }
})
    .then(pasuxi => pasuxi.json())
    .then(data => {
        console.log(data);
        section.innerHTML = `<h1>Hello, ${data.firstName}</h1>
`
    });


function renderCheckout(cartItems) {
  // cart.innerHTML = "";
  cartItems.forEach((item) => (historylist.innerHTML += cartList(item)));
}

function loadCheckout() {
  const cartItemsString = localStorage.getItem("cartItems");
  const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];
  renderCheckout(cartItems);
}

function cartList(item) {
  return `<li class="cartItem">
            <img src="${item.product.image}" alt="">
            <h3>${item.product.name}.</h3>
            <h3>Quantity <span id="quantity-${item.product.id}">${item.quantity}</span> </h3>
            <h3>Price: ${item.price}</h3>
            <h3>Total: <span id="total-${item.product.id}">${item.quantity * item.price}</span></h3>
        </li>`;
}


loadCheckout();