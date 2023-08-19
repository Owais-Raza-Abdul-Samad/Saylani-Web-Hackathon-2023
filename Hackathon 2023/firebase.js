import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  serverTimestamp,
  collection,
  query,
  where,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyB8qIwR08u5WXFDojBOx3_Vvmuw3K2g6Kw",
  authDomain: "saylani-web-hackathon.firebaseapp.com",
  projectId: "saylani-web-hackathon",
  storageBucket: "saylani-web-hackathon.appspot.com",
  messagingSenderId: "1038573970992",
  appId: "1:1038573970992:web:c360b1bee3ea0d94c7aff5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();
const storage = getStorage();

export {
  auth,
  createUserWithEmailAndPassword,
  db,
  setDoc,
  doc,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  provider,
  signOut,
  getDoc,
  addDoc,
  serverTimestamp,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  ref,
  storage,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
};
