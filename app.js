const hamMenuBtn = document.querySelector(".hamMenu")
const offScreen = document.querySelector(".offScreen")

hamMenuBtn.addEventListener("click", () => {
hamMenuBtn.classList.toggle("active")
offScreen.classList.toggle("active")
})

const signInBtn = document.querySelector(".signIn");


let selectedCategory = null;
let categories = [];
let cartItems = [];

let filters = {
  spiciness: null,
  noNuts: false,
  vegetarianOnly: false,
};

function renderCategories() {
  let categoriesSection = document.getElementById("categories");

  categoriesSection.innerHTML = "";

  categories.forEach((cat) => {
    categoriesSection.innerHTML += `
                <button class="category-btn ${cat.id === selectedCategory ? "active" : ""}" 
                        onclick="selectCategory(${cat.id})">
                    ${cat.name}
                </button>
            `;
  });
}

function loadCategories() {
  fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
    .then((response) => response.json())
    .then((data) => {
      data.unshift({ id: null, name: "ALL" });
      categories = data;
      renderCategories();
    });
}

function cardCode(product) {
  return `<div class="product-card">
                    <img class="product-image" 
                         src="${product.image || "https://via.placeholder.com/300x200?text=" + product.name}" 
                         alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/300x200?text=' + (${product.name}')">
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-meta">
                            <span class="spiciness">🌶️ Spiciness: ${product.spiciness}</span>
                        </div>
                        <div class="product-tags">
                            ${product.nuts ? '<span class="tag nuts">🥜 Contains Nuts</span>' : ""}
                            ${product.vegeterian ? '<span class="tag vegetarian">🥗 Vegetarian</span>' : ""}
                        </div>
                        <div class="product-footer">
                            <div class="product-price">$${product.price.toFixed(2)}</div>
                            <button class="add-to-cart-btn" onclick="addToCart(${product.id},  ${product.price})">
                                Add to cart
                            </button>
                        </div>
                    </div>
                </div>`;
}

function renderProducts(data) {
  let products = document.getElementById("products");
  products.innerHTML = "";
  data.forEach((prod) => {
    products.innerHTML += cardCode(prod);
  });
}

function loadProducts() {
  fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
    .then((response) => response.json())
    .then((data) => {
      renderProducts(data);
    });
}

function selectCategory(categoryId) {
  selectedCategory = categoryId;
  renderCategories();
  applyFilters();
}

function applyFilters() {
  const spicinessVal = parseInt(
    document.getElementById("spicinessFilter").value,
  );
  filters.spiciness = spicinessVal === -1 ? null : spicinessVal;
  filters.noNuts = document.getElementById("noNutsFilter").checked;
  filters.vegetarianOnly = document.getElementById("vegetarianFilter").checked;

  // Build query params
  const params = new URLSearchParams();
  if (selectedCategory !== null) params.append("categoryId", selectedCategory);
  if (filters.spiciness !== null) params.append("spiciness", filters.spiciness);
  if (filters.noNuts) params.append("nuts", "false");
  if (filters.vegetarianOnly) params.append("vegeterian", "true");

  const url = params.toString()
    ? `https://restaurant.stepprojects.ge/api/Products/GetFiltered?${params}`
    : `https://restaurant.stepprojects.ge/api/Products/GetAll`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      renderProducts(data);
    });
}

function resetFilters() {
  document.getElementById("spicinessFilter").value = -1;
  document.getElementById("spicinessValue").textContent = "Not Chosen";
  document.getElementById("noNutsFilter").checked = false;
  document.getElementById("vegetarianFilter").checked = false;
  filters = { spiciness: null, noNuts: false, vegetarianOnly: false };
  selectedCategory = null;
  renderCategories();
  loadProducts();
}

// Setup Filter Listeners
function setupFilterListeners() {
  const spicinessFilter = document.getElementById("spicinessFilter");
  const spicinessValue = document.getElementById("spicinessValue");
  

  spicinessFilter.addEventListener("input", (e) => {
    const val = parseInt(e.target.value);
    spicinessValue.textContent = val === -1 ? "Not Chosen" : val;
  });
}

function addToCart(productId, price) {
  const btn = event.target;
  btn.disabled = true;
  btn.textContent = "Adding...";

  const isInCart = cartItems.find((item) => item.product.id === productId);
  if (isInCart) {
    fetch(`https://restaurant.stepprojects.ge/api/Baskets/UpdateBasket`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: productId,
        quantity: isInCart.quantity + 1,
        price: price,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        loadCart();
        btn.textContent = "Added!";
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = "Add to cart";
        }, 1000);
      });
  } else {
    fetch(`https://restaurant.stepprojects.ge/api/Baskets/AddToBasket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: productId,
        quantity: 1,
        price: price,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        loadCart();
        btn.textContent = "Added!";
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = "Add to cart";
        }, 1000);
      });
  }
}

function loadCart() {
  fetch("https://restaurant.stepprojects.ge/api/Baskets/GetAll")
    .then((pasuxi) => pasuxi.json())
    .then((data) => {
      cartItems = data;
    });
}

function init() {
  setupFilterListeners();
  loadCategories();
  loadProducts();
  loadCart();
}

init();
