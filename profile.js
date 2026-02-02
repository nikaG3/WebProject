const historylist = document.getElementById("cartHstr");
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
  const header = `<li class="cartHeader">
    <div>Image</div>
    <div>Product</div>
    <div>Quantity</div>
    <div>Price</div>
    <div>Total</div>
  </li>`;

  const rows = cartItems.map((item) => cartList(item)).join("\n");

  let totalQuantity = 0;
  let totalPrice = 0;
  cartItems.forEach(item => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.price ?? (item.product && item.product.price)) || 0;
    totalQuantity += qty;
    totalPrice += qty * price;
  });

  const footer = `<li class="cartFooter">
    <div></div>
    <div style="font-weight:700">Totals</div>
    <div>${totalQuantity}</div>
    <div></div>
    <div>${totalPrice.toFixed(2)}</div>
    <div></div>
  </li>`;

  historylist.innerHTML = header + rows + footer;
}

function loadCheckout() {
  const cartItemsString = localStorage.getItem("cartItems");
  const cartItems = cartItemsString ? JSON.parse(cartItemsString) : [];
  renderCheckout(cartItems);
}

function cartList(item) {
  const date = item.date ? new Date(item.date).toLocaleDateString() : "-";
  const price = item.price ?? (item.product && item.product.price) ?? "-";
  const total = (item.quantity && price) ? (item.quantity * price) : "-";
  return `<li class="cartItem">
            <img src="${item.product.image || ''}" alt="">
            <div>
              <h3 class="productName">${item.product.name || 'Product'}</h3>
              <div class="smallNote">${item.product.description || ''}</div>
            </div>
            <div>${item.quantity || 1}</div>
            <div>${price}</div>
            <div>${total}</div>
            <div>${date}</div>
        </li>`;
}


loadCheckout();