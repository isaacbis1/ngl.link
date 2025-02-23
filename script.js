// Configura Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC9mIsxGC5nhr2ExIlguePsPMGi5s69MsI",
  authDomain: "ngl-link-isaacbis.firebaseapp.com",
  projectId: "ngl-link-isaacbis",
  storageBucket: "ngl-link-isaacbis.firebasestorage.app",
  messagingSenderId: "551004938464",
  appId: "1:551004938464:web:74781b8bdf51a008d4f085",
  measurementId: "G-1HND4WD5ND"
};

// Inizializza Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Elementi DOM
const loginButton = document.querySelector(".login-btn");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBox = document.querySelector(".login-box");
const contentBox = document.querySelector(".content-box");
const sendButton = document.querySelector(".send-btn");
const receiveButton = document.querySelector(".receive-btn");
const messageTextarea = document.getElementById("message");
const logoutButton = document.querySelector(".logout-btn");
const userEmail = document.getElementById("user-email");

// Controlla se l'utente è già loggato
auth.onAuthStateChanged(user => {
    if (user) {
        showContent(user.email);
    } else {
        loginBox.style.display = "block";
    }
});

// Login o Registrazione Automatica
loginButton.addEventListener("click", function () {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    auth.signInWithEmailAndPassword(email, password)
        .then(() => showContent(email))
        .catch(error => {
            if (error.code === "auth/user-not-found") {
                auth.createUserWithEmailAndPassword(email, password)
                    .then(() => showContent(email))
                    .catch(err => document.getElementById("login-error").innerText = err.message);
            } else {
                document.getElementById("login-error").innerText = error.message;
            }
        });
});

// Mostra il contenuto dopo il login
function showContent(email) {
    userEmail.innerText = email;
    loginBox.style.display = "none";
    contentBox.classList.remove("hidden");
}

// Logout
logoutButton.addEventListener("click", function () {
    auth.signOut().then(() => location.reload());
});

// Salva il messaggio nel database
sendButton.addEventListener("click", function () {
    const message = messageTextarea.value.trim();
    if (message === "") {
        alert("Il messaggio non può essere vuoto!");
        return;
    }

    const user = auth.currentUser;
    if (user) {
        db.collection("messages").add({
            userEmail: user.email,
            message: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            alert("Messaggio inviato con successo!");
            messageTextarea.value = "";
        }).catch(error => console.error("Errore nel salvataggio del messaggio:", error));
    }
});

// Carica i messaggi ricevuti
receiveButton.addEventListener("click", function () {
    const user = auth.currentUser;
    if (user) {
        db.collection("messages").where("userEmail", "==", user.email)
            .orderBy("timestamp", "desc")
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => console.log("Messaggio:", doc.data().message));
            }).catch(error => console.error("Errore nel recupero dei messaggi:", error));
    }
});
