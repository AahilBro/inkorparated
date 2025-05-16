import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your Firebase config - update to your new project config
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
const db = getFirestore(app);
const auth = getAuth(app);

const newsListEl = document.getElementById("news-list");
const newsEditorEl = document.getElementById("news-editor");
const newsTitleInput = document.getElementById("news-title");
const newsContentInput = document.getElementById("news-content");
const addNewsBtn = document.getElementById("add-news-btn");

let userDisplayName = "";

// Function to load news from Firestore and display
async function loadNews() {
  newsListEl.textContent = "Loading news...";
  newsListEl.innerHTML = "";
  const newsCol = collection(db, "news");
  const newsSnapshot = await getDocs(newsCol);

  if (newsSnapshot.empty) {
    newsListEl.textContent = "No news yet.";
    return;
  }

  newsSnapshot.forEach(doc => {
    const data = doc.data();
    const newsItem = document.createElement("div");
    newsItem.style.borderBottom = "1px solid #30363d";
    newsItem.style.padding = "10px 0";
    newsItem.innerHTML = `
      <h2 style="color:#58a6ff;">${data.title}</h2>
      <p>${data.content}</p>
    `;
    newsListEl.appendChild(newsItem);
  });
}

// Function to check if user is "Aahil Jawad" and show editor
function checkUser(user) {
  if (user && user.displayName === "Aahil Jawad") {
    userDisplayName = user.displayName;
    newsEditorEl.style.display = "block";
  } else {
    newsEditorEl.style.display = "none";
  }
}

// Add or update news in Firestore
async function addOrUpdateNews() {
  const title = newsTitleInput.value.trim();
  const content = newsContentInput.value.trim();
  if (!title || !content) {
    alert("Please fill in both title and content.");
    return;
  }

  try {
    // Use title as doc ID for easy updates
    const newsDocRef = doc(db, "news", title.toLowerCase().replace(/\s+/g, "-"));
    await setDoc(newsDocRef, { title, content, editedBy: userDisplayName });
    alert("News updated!");
    newsTitleInput.value = "";
    newsContentInput.value = "";
    loadNews();
  } catch (error) {
    alert("Error updating news: " + error.message);
  }
}

// Event listeners
addNewsBtn.addEventListener("click", addOrUpdateNews);

onAuthStateChanged(auth, (user) => {
  checkUser(user);
  loadNews();
});
