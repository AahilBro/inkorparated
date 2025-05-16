import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, onSnapshot, addDoc
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Your Firebase config here
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

const dictionaryList = document.getElementById("dictionary-list");
const dictionaryForm = document.getElementById("dictionary-form");
const wordInput = document.getElementById("word");
const definitionInput = document.getElementById("definition");
const saveWordBtn = document.getElementById("save-word");

const adminEmail = "sheeshlol@example.com"; // Who can add words

// Load dictionary entries live
function loadDictionary() {
  const dictionaryRef = collection(db, "penDictionary");

  onSnapshot(dictionaryRef, (snapshot) => {
    dictionaryList.innerHTML = "";
    if (snapshot.empty) {
      dictionaryList.textContent = "No dictionary entries yet.";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      const entryDiv = document.createElement("div");
      entryDiv.style.borderBottom = "1px solid #30363d";
      entryDiv.style.marginBottom = "10px";
      entryDiv.style.paddingBottom = "8px";

      const wordTitle = document.createElement("h3");
      wordTitle.textContent = data.word;
      wordTitle.style.color = "#58a6ff";

      const definitionPara = document.createElement("p");
      definitionPara.textContent = data.definition;

      entryDiv.appendChild(wordTitle);
      entryDiv.appendChild(definitionPara);

      dictionaryList.appendChild(entryDiv);
    });
  });
}

// Save new dictionary word
async function saveWord() {
  const word = wordInput.value.trim();
  const definition = definitionInput.value.trim();

  if (!word || !definition) {
    alert("Please fill in both the word and the definition.");
    return;
  }

  try {
    await addDoc(collection(db, "penDictionary"), {
      word,
      definition,
      timestamp: new Date()
    });
    wordInput.value = "";
    definitionInput.value = "";
    alert("Word added to the dictionary!");
  } catch (e) {
    alert("Error adding word: " + e.message);
  }
}

// Show add form if admin logged in
onAuthStateChanged(auth, (user) => {
  if (user && user.email === adminEmail) {
    dictionaryForm.style.display = "block";
  } else {
    dictionaryForm.style.display = "none";
  }
});

saveWordBtn.addEventListener("click", saveWord);
loadDictionary();
