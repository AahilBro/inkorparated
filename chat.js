// chat.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

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

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

// Show messages function
function showMessage(data) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.textContent = `${data.penName || "Anon"}: ${data.message}`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Load messages live
const q = query(collection(db, "chatMessages"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
  chatMessages.innerHTML = ""; // clear messages first
  snapshot.forEach(doc => {
    showMessage(doc.data());
  });
});

// Send new message
sendBtn.onclick = async () => {
  const message = chatInput.value.trim();
  if (!message) return alert("Type a message first!");

  // You can set penName however you want, here it’s a simple example:
  const penName = prompt("Enter your Pen Name") || "Anon";

  await addDoc(collection(db, "chatMessages"), {
    message,
    penName,
    timestamp: serverTimestamp(),
  });

  chatInput.value = "";
};
