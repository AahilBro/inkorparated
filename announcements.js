import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, getDocs, addDoc, onSnapshot
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your Firebase config here (make sure to update it)
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

const announcementList = document.getElementById("announcement-list");
const announcementForm = document.getElementById("announcement-form");
const titleInput = document.getElementById("announcement-title");
const textInput = document.getElementById("announcement-text");
const saveBtn = document.getElementById("save-announcement");

const adminEmail = "sheeshlol@example.com"; // The one allowed to edit announcements

// Show announcements live
function loadAnnouncements() {
  const announcementsRef = collection(db, "announcements");

  onSnapshot(announcementsRef, (snapshot) => {
    announcementList.innerHTML = "";
    if (snapshot.empty) {
      announcementList.textContent = "No announcements yet.";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.style.borderBottom = "1px solid #30363d";
      div.style.marginBottom = "10px";
      div.style.paddingBottom = "8px";

      const h3 = document.createElement("h3");
      h3.textContent = data.title;
      h3.style.color = "#58a6ff";

      const p = document.createElement("p");
      p.textContent = data.text;

      div.appendChild(h3);
      div.appendChild(p);

      announcementList.appendChild(div);
    });
  });
}

// Save new announcement
async function saveAnnouncement() {
  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if (!title || !text) {
    alert("Please fill both title and announcement text.");
    return;
  }

  try {
    await addDoc(collection(db, "announcements"), {
      title,
      text,
      timestamp: new Date()
    });
    titleInput.value = "";
    textInput.value = "";
    alert("Announcement saved!");
  } catch (e) {
    alert("Error saving announcement: " + e.message);
  }
}

// Check if user is admin to show form
onAuthStateChanged(auth, (user) => {
  if (user && user.email === adminEmail) {
    announcementForm.style.display = "block";
  } else {
    announcementForm.style.display = "none";
  }
});

// Event listener to save announcement
saveBtn.addEventListener("click", saveAnnouncement);

// Load announcements on page load
loadAnnouncements();
