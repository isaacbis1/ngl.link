// CONFIGURAZIONE E INIZIALIZZAZIONE FIREBASE (compat)
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
  const sendBtn = document.getElementById("sendBtn");
  const messageTextarea = document.getElementById("message");
  const receiveBtn = document.getElementById("receiveBtn");

  sendBtn.addEventListener("click", () => {
    const message = messageTextarea.value.trim();
    if (!message) {
      alert("Il messaggio non può essere vuoto!");
      return;
    }
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
});
