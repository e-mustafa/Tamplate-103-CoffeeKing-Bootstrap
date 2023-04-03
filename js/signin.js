
// show/hide password in input ------------------------------------------
const showPass = document.querySelector(".input-group .show-pass");
const hidePass = document.querySelector(".input-group .hide-pass");

showPass.addEventListener("click", () => {
   let inputPass = showPass.previousElementSibling;
   inputPass.type = "text";
   showPass.style.display = "none";
   hidePass.style.display = "inline-block";
});

hidePass.addEventListener("click", () => {
   let inputPass = hidePass.previousElementSibling.previousElementSibling;
   inputPass.type = "password";
   hidePass.style.display = "none";
   showPass.style.display = "inline-block";
});

// handel submit for signIn form ------------------------------------------------------------
const form_signin = document.querySelector("#form_signin")
const S_username = document.getElementById("S_username")
const S_password = document.getElementById("S_password")
const feedback_div = document.querySelector(".invalid-feedback")

onload = () =>{
   [S_username, S_password].forEach(input => {
      input.addEventListener("input", (e) => {
         // when inputting add in-valid or is-invalid
         if (e.target.value.length = 0) {
            e.target.classList.add("is-invalid")
         } else {
            e.target.classList.replace("is-invalid", "is-valid")
            || e.target.classList.add("is-valid");;
         }
      })
   });
}
function handelSignin(e) {
   e.preventDefault();
   feedback_div.style.display = "block"
   if(S_username.value === "" && S_password.value ===""){
      feedback_div.textContent = "Please fill in all fields!";
      S_username.classList.add("is-invalid");
      S_password.classList.add("is-invalid");
      S_username.focus();
   }else{
      let data = JSON.parse(localStorage.getItem("userRegistration"))
      feedback_div.textContent = ""
      if(localStorage.getItem("userRegistration") && (S_username.value.trim() === data.username && S_password.value.trim() === data.password)){
         console.log("all same");
         feedback_div.textContent = ""
         setTimeout( () => window.location.assign("index.html" ,1500))
      }else{
         feedback_div.textContent = "Username or password is wrong!";
         S_password.focus();
      }
   }
}
form_signin.addEventListener("submit", handelSignin);

