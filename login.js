// Firebase imports
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC9Y4hjZ3Xzp3nhO6IHKyvlyi7miwcbAQM",
  authDomain: "inkorparated-d3048.firebaseapp.com",
  projectId: "inkorparated-d3048",
  storageBucket: "inkorparated-d3048.appspot.com",
  messagingSenderId: "47204320585",
  appId: "1:47204320585:web:104fff16052b9e032ec698",
  measurementId: "G-QTGWC06G7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const googleLoginBtn = document.getElementById("googleLoginBtn");
const loginStep2 = document.getElementById("loginStep2");
const enterHub = document.getElementById("enterHub");

let userDisplayName = "";

googleLoginBtn.onclick = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      userDisplayName = result.user.displayName;
      sessionStorage.setItem("googleName", userDisplayName);
      googleLoginBtn.style.display = "none";
      loginStep2.style.display = "block";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
};

enterHub.onclick = async () => {
  const penName = document.getElementById("penName").value.trim();
  const sitePassword = document.getElementById("sitePassword").value;

  if (sitePassword === "ink" && penName !== "") {
    try {
      // Save penName + googleName to Firestore
      await addDoc(collection(db, "users"), {
        penName: penName,
        googleName: userDisplayName,
        timestamp: serverTimestamp(),
      });

      sessionStorage.setItem("penName", penName);
      window.location.href = "hub.html";
    } catch (e) {
      console.error("Error adding user to Firestore: ", e);
      alert("Couldn't save user data! Try again.");
    }
  } else {
    alert("Wrong password or empty pen name!");
  }
};
