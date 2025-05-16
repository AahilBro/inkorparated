import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyC9Y4hjZ3Xzp3nhO6IHKyvlyi7miwcbAQM",
  authDomain: "inkorparated-d3048.firebaseapp.com",
  projectId: "inkorparated-d3048",
  storageBucket: "inkorparated-d3048.firebasestorage.app",
  messagingSenderId: "47204320585",
  appId: "1:47204320585:web:104fff16052b9e032ec698",
  measurementId: "G-QTGWC06G7X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

let userDisplayName = "";

document.getElementById("login-btn").addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      userDisplayName = result.user.displayName;
      document.getElementById("login-screen").style.display = "none";
      document.getElementById("penname-screen").style.display = "block";
    });
});

document.getElementById("submit-btn").addEventListener("click", async () => {
  const penname = document.getElementById("penname-input").value.trim();
  const password = document.getElementById("sitepass-input").value.trim();

  if (password === "ink" && penname !== "") {
    await setDoc(doc(db, "users", userDisplayName), {
      penName: penname,
      displayName: userDisplayName
    });
    window.location.href = "/hub.html";
  } else {
    alert("Wrong password or missing pen name!");
  }
});
