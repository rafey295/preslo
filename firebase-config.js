import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDiNFKtH_79T3MXzLQU35KFNXBEnlgqiBI",
  authDomain: "preslo.firebaseapp.com",
  projectId: "preslo",
  storageBucket: "preslo.firebasestorage.app",
  messagingSenderId: "46217440686",
  appId: "1:46217440686:web:b7db6892130a55fd5eac3f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.PresloAuth = {
  auth: auth,
  db: db,
  createUserWithEmailAndPassword: createUserWithEmailAndPassword,
  signInWithEmailAndPassword: signInWithEmailAndPassword,
  onAuthStateChanged: onAuthStateChanged,
  signOut: signOut,
  doc: doc,
  setDoc: setDoc,
  getDoc: getDoc
};

window.dispatchEvent(new Event('preslo-firebase-ready'));