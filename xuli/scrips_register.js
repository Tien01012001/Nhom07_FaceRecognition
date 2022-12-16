let username = document.getElementById("un");
let password = document.getElementById("mk");
let btnSignup = document.querySelector(".btn-register");



btnSignup.addEventListener("click", (e) => {
  e.preventDefault();
  let user = {
    username: username.value,
    password: password.value,
    role: "User"
  };
  let json = JSON.stringify(user);
  if (!username.value || !password.value) {
    alert("vui long nhap day du thong tin");
  } else {
    localStorage.setItem(username.value, json);
    alert("dang ky thanh cong");
    window.location.href = "login.html"
  }
});