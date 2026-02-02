function openSignIn() {
  document.querySelector(".signInWindow").classList.add("active");
  document.querySelector(".mainContent").classList.add("blurred");
}
function closeBtn() {
  document.querySelector(".signInWindow").classList.remove("active");
  document.querySelector(".mainContent").classList.remove("blurred");
}
function openSignUp() {
  closeBtn();
  setTimeout(() => {
    document.querySelector(".signUpWindow").classList.add("active");
  }, 300);
  document.querySelector(".mainContent").classList.add("blurred");
}

function closeSignUp() {
  document.querySelector(".signUpWindow").classList.remove("active");
  document.querySelector(".mainContent").classList.remove("blurred");
}
function reOpenSignIn() {
  closeSignUp();
  setTimeout(() => {
    openSignIn();
  }, 300);
  document.querySelector(".mainContent").classList.add("blurred");
}

function register(e) {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password-register").value;
  const phone = document.getElementById("phone").value;
  const age = document.getElementById("age").value;
  const address = document.getElementById("address").value;
  const zipcode = document.getElementById("zipcode").value;
  const gender = document.getElementById("gender").value;

  fetch("https://api.everrest.educata.dev/auth/sign_up", {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      phone: `+995${phone}`,
      age,
      address,
      zipcode,
      gender,
      avatar: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Jane",
    }),
  })
    .then((pasuxi) => pasuxi.json())
    .then((data) => {
      console.log(data);
      reOpenSignIn();
    });
}

function login(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("https://api.everrest.educata.dev/auth/sign_in", {
    method: "POST",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((pasuxi) => pasuxi.json())
    .then((data) => {
      Cookies.set("user", data.access_token);
      gotoProfile();
    });
}

function logOut() {
  Cookies.remove("user");
  window.location.href = "index.html";
}

function gotoProfile() {
  if (Cookies.get("user")) {
    window.location.href = "profile.html";
  } else {
    alert("Please log in first.");
  }
}

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

if (togglePassword && password) {
  togglePassword.addEventListener("click", function (e) {

    const type =
      password.getAttribute("type") === "password" ? "text" : "password";
    password.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
  });
}

const togglePasswordRegister = document.querySelector(
  "#togglePassword-register",
);
const passwordRegister = document.getElementById("password-register");

if (togglePasswordRegister && passwordRegister) {
  togglePasswordRegister.addEventListener("click", function (e) {
    const type =
      passwordRegister.getAttribute("type") === "password"
        ? "text"
        : "password";
    passwordRegister.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
  });
}

let signInButton = document.querySelector(".signIn");

if (Cookies.get("user")) {
  signInButton.children[0].innerText = "Sign Out";
  signInButton.onclick = function () {
    logOut();
  };
} else {
  signInButton.children[0].innerText = "Sign In";
  signInButton.onclick = function () {
    openSignIn();
  };
}
