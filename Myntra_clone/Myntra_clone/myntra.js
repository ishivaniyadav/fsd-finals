// ===============================
// 1️⃣ HAMBURGER MENU
// ===============================
const hamburger = document.createElement('div');
hamburger.classList.add('hamburger');
hamburger.innerHTML = '<span class="material-symbols-outlined">menu</span>';
document.querySelector('header').insertBefore(hamburger, document.querySelector('.acttion'));

hamburger.addEventListener('click', () => {
  document.querySelector('.navbar').classList.toggle('active');
});

// ===============================
// 2️⃣ LOGIN & SIGNUP POPUP
// ===============================
const loginPopup = document.createElement('div');
loginPopup.classList.add('login-popup');
loginPopup.innerHTML = `
  <div class="popup-content">
    <span class="close-btn">&times;</span>

    <div class="login-form">
      <h2>Welcome Back!</h2>
      <input id="loginEmail" type="text" placeholder="Enter Email or Phone">
      <input id="loginPass" type="password" placeholder="Enter Password">
      <button class="login-btn">Login</button>
      <button class="cancel-btn">Cancel</button>
      <p>Don't have an account? <a href="#" id="goSignup">Sign up</a></p>
    </div>

    <div class="signup-form" style="display:none;">
      <h2>Create Account</h2>
      <input id="signupName" type="text" placeholder="Full Name">
      <input id="signupEmail" type="email" placeholder="Email Address">
      <input id="signupPass" type="password" placeholder="Create Password">
      <input id="signupConfirm" type="password" placeholder="Confirm Password">
      <button class="signup-btn">Sign Up</button>
      <button class="cancel-btn">Cancel</button>
      <p>Already have an account? <a href="#" id="goLogin">Login</a></p>
    </div>
  </div>
`;
document.body.appendChild(loginPopup);

// ===============================
// 3️⃣ ELEMENT REFERENCES
// ===============================
const profileBtn = document.querySelector('.acttion-container:first-child');
const closeBtn = loginPopup.querySelector('.close-btn');
const cancelBtns = loginPopup.querySelectorAll('.cancel-btn');
const loginBtn = loginPopup.querySelector('.login-btn');
const signupBtn = loginPopup.querySelector('.signup-btn');
const goSignup = loginPopup.querySelector('#goSignup');
const goLogin = loginPopup.querySelector('#goLogin');
const loginForm = loginPopup.querySelector('.login-form');
const signupForm = loginPopup.querySelector('.signup-form');

// ===============================
// 4️⃣ POPUP OPEN/CLOSE
// ===============================
profileBtn.addEventListener('click', () => loginPopup.style.display = 'flex');
closeBtn.addEventListener('click', () => loginPopup.style.display = 'none');
cancelBtns.forEach(btn => btn.addEventListener('click', () => loginPopup.style.display = 'none'));
loginPopup.addEventListener('click', e => { if (e.target === loginPopup) loginPopup.style.display = 'none'; });

// ===============================
// 5️⃣ TOGGLE LOGIN ↔ SIGNUP
// ===============================
goSignup.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
});
goLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// ===============================
// 6️⃣ LOGIN VALIDATION
// ===============================
loginBtn.addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value.trim();

  if (email === "" || pass === "") {
    alert("⚠️ Please fill in both fields!");
  } else {
    showMessage(`Welcome back to Myntra, ${email}!`);
    loginPopup.style.display = 'none';
    // Redirect to myntra.html after login
    window.location.href = "myntra.html";
  }
});

// ===============================
// 7️⃣ SIGNUP VALIDATION
// ===============================
signupBtn.addEventListener('click', () => {
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const pass = document.getElementById('signupPass').value.trim();
  const confirm = document.getElementById('signupConfirm').value.trim();

  if (!name || !email || !pass || !confirm) {
    alert("⚠️ Please fill all fields!");
  } else if (pass !== confirm) {
    alert("⚠️ Passwords do not match!");
  } else {
    showMessage(`Account created successfully, ${name}! 🎉`);
    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
  }
});

// ===============================
// 8️⃣ SHOW MESSAGE ON TOP
// ===============================
function showMessage(message) {
  const msgDiv = document.createElement('div');
  msgDiv.textContent = message;
  msgDiv.style.position = 'fixed';
  msgDiv.style.top = '20px';
  msgDiv.style.left = '50%';
  msgDiv.style.transform = 'translateX(-50%)';
  msgDiv.style.background = '#fff';
  msgDiv.style.color = 'black';
  msgDiv.style.padding = '10px 20px';
  msgDiv.style.borderRadius = '5px';
  msgDiv.style.fontFamily = 'Poppins, sans-serif';
  msgDiv.style.zIndex = '2000';
  document.body.appendChild(msgDiv);

  setTimeout(() => msgDiv.remove(), 3000);
}

// ===============================
// 9️⃣ NAVBAR SCROLL FUNCTIONALITY (with offset)
// ===============================
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const section = document.querySelector(targetId);

    if (section) {
      const yOffset = -100; // adjust based on header height
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  });
});
// ===============================
// Update wishlist & bag counts from localStorage
// ===============================

  document.addEventListener("DOMContentLoaded", () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const bag = JSON.parse(localStorage.getItem("bag")) || [];
    document.getElementById("wishlist-count").textContent = wishlist.length;
    document.getElementById("bag-count").textContent = bag.length;
  });