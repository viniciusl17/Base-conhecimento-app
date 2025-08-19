import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile
} from "firebase/auth";
import { 
    getFirestore, 
    collection, 
    onSnapshot, 
    addDoc, 
    doc, 
    updateDoc, 
    deleteDoc, 
    serverTimestamp, 
    query, 
    getDoc, 
    orderBy,
    setDoc 
} from "firebase/firestore";

// Suas credenciais do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCtdqzrPbGcVX7ALspDHW4vtaBIXNkWtnk",
  authDomain: "base-conhecimento-app-14b9a.firebaseapp.com",
  projectId: "base-conhecimento-app-14b9a",
  storageBucket: "base-conhecimento-app-14b9a.appspot.com",
  messagingSenderId: "872795912891",
  appId: "1:872795912891:web:fc0c01c16f1bda68cb079e"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que serão usados na aplicação
export const auth = getAuth(app);
export const db = getFirestore(app);

// Exporta as funções para facilitar a importação em outros arquivos
export {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  getDoc,
  orderBy,
  setDoc
};
