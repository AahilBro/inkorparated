import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, getDoc
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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
const auth = getAuth();

const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");

let userPenName = null;

// 👤 Wait for user login
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("You're not logged in!");
    window.location.href = "index.html"; // redirect to login page
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      alert("Pen Name not set! Go back and set it up.");
      return;
    }

    userPenName = userDoc.data().penName || "Anon";

    // ✅ Now start listening to chat
    const q = query(collection(db, "chatMessages"), orderBy("timestamp"));
    onSnapshot(q, (snapshot) => {
      chatMessages.innerHTML = ""; // clear messages
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.textContent = `${data.penName || "Anon"}: ${data.message}`;
        chatMessages.appendChild(div);
      });
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });

  } catch (error) {
    console.error("Error loading user data:", error);
    alert("Something went wrong loading your user data.");
  }
});

// 📨 Send messages
sendBtn.onclick = async () => {
  const message = chatInput.value.trim();
  if (!message) return alert("Type a message first!");
  if (!userPenName) return alert("Pen Name not loaded!");

  try {
    await addDoc(collection(db, "chatMessages"), {
      message,
      penName: userPenName,
      timestamp: serverTimestamp(),
    });

    chatInput.value = "";
  } catch (err) {
    console.error("Error sending message:", err);
    alert("Failed to send message.");
  }
};
