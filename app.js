// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC9Y4hjZ3Xzp3nhO6IHKyvlyi7miwcbAQM",
  authDomain: "inkorparated-d3048.firebaseapp.com",
  projectId: "inkorparated-d3048",
  storageBucket: "inkorparated-d3048.firebasestorage.app",
  messagingSenderId: "47204320585",
  appId: "1:47204320585:web:104fff16052b9e032ec698",
  measurementId: "G-QTGWC06G7X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// UI Elements
const loginBtn = document.getElementById("login-btn");
const loginScreen = document.getElementById("login-screen");
const penNameScreen = document.getElementById("penname-screen");
const penNameInput = document.getElementById("penname-input");
const sitePassInput = document.getElementById("sitepass-input");
const submitBtn = document.getElementById("submit-btn");

let userData = null;

// Login with Google
loginBtn.addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    userData = result.user;
    loginScreen.style.display = "none";
    penNameScreen.style.display = "block";
  } catch (error) {
    console.error("Login error:", error);
  }
});

// Submit Pen Name and Password
submitBtn.addEventListener("click", async () => {
  const penName = penNameInput.value;
  const sitePass = sitePassInput.value;

  if (sitePass !== "ink") {
    alert("Wrong password!");
    return;
  }

  if (penName.length < 2) {
    alert("Pen name too short!");
    return;
  }

  await setDoc(doc(db, "users", userData.uid), {
    displayName: userData.displayName,
    penName: penName,
    uid: userData.uid
  });

  window.location.href = "/hub.html";
});
