// hub.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;

// Show selected tab and hide others
window.showTab = function (tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });

  const selectedTab = document.getElementById(tabId);
  if (selectedTab) {
    selectedTab.style.display = 'block';
  }
};

// Load tab content from Firestore
function loadTabs() {
  const staticTabs = ['laws', 'news', 'announcements', 'dictionary'];

  staticTabs.forEach(tab => {
    const docRef = doc(db, tab, "main");
    onSnapshot(docRef, docSnap => {
      const el = document.getElementById(tab);
      if (!el) return;
      if (docSnap.exists()) {
        el.innerText = docSnap.data().text || `No ${tab} data available.`;
      } else {
        el.innerText = `No ${tab} data available.`;
      }
    });
  });

  // Load chat messages
  const chatRef = collection(db, 'chat');
  onSnapshot(chatRef, snapshot => {
    const chatMessages = document.getElementById("chat-messages");
    if (!chatMessages) return;
    chatMessages.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement("div");
      div.innerText = `${data.penName}: ${data.message}`;
      chatMessages.appendChild(div);
    });
  });
}

// Send chat message
window.sendMessage = async function () {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();
  const penName = sessionStorage.getItem("penName") || currentUser.displayName;
  if (!message) return;

  await addDoc(collection(db, "chat"), {
    penName,
    message,
    timestamp: serverTimestamp()
  });

  input.value = "";
};

// Auth check and init
onAuthStateChanged(auth, user => {
  if (user) {
    currentUser = user;
    loadTabs();
    showTab('laws'); // Show default tab on load
  } else {
    alert("Not logged in. Please go to the login page.");
    window.location.href = "/index.html";
  }
});
