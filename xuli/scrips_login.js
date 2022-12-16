let username = document.getElementById("un");
let password = document.getElementById("mk");
let role = document.getElementById("role");
let btnLogin = document.querySelector(".btn-login");


var admin = 
    {
        username: "admin",
        password: "admin",
        role: "Admin"
    }

var users = 
    {
        username: "user",
        password: "user",
        role: "User"
    }



btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  let user = {
    username: username.value,
    password: password.value,
    role: role.value
  };

  let json = JSON.stringify(user,password,role);
  if (!username.value || !role.value || !password.value) {
    alert("vui long nhap day du thong tin");
  }
  else if(role.value == "Admin"){
    if(username.value == admin.username && role.value==admin.role && password.value== admin.password){
        alert("dang nhap thanh cong");
        window.location.href = "admin.html";
    }
    else{
        alert("dang nhap that bai");
    }
  }
  else if (localStorage.getItem(username.value,password.value,role.value) == json||(username.value == users.username && role.value==users.role && password.value== users.password)) {
    alert("dang nhap thanh cong");
    window.location.href = "index.html";
  }
  else{
    alert("dang nhap that bai");
    console.log(localStorage.getItem(username.value,password.value,role.value))
  }
});

