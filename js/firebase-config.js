// Firebase configuration
// Uses environment variables when available, fallback to hardcoded values for development
const firebaseConfig = {
    apiKey: window?.process?.env?.FIREBASE_API_KEY || "AIzaSyDC5wv7g_SVN5TUu0mJaNCXsixQ2xGEn0U",
    authDomain: window?.process?.env?.FIREBASE_AUTH_DOMAIN || "sample-firebase-ai-app-f3995.firebaseapp.com", 
    projectId: window?.process?.env?.FIREBASE_PROJECT_ID || "sample-firebase-ai-app-f3995",
    storageBucket: window?.process?.env?.FIREBASE_STORAGE_BUCKET || "sample-firebase-ai-app-f3995.firebasestorage.app",
    messagingSenderId: window?.process?.env?.FIREBASE_MESSAGING_SENDER_ID || "1075039632976",
    appId: window?.process?.env?.FIREBASE_APP_ID || "1:1075039632976:web:9f935823d04bb460e25b55"
};

// Initialize Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile, updatePassword, deleteUser } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, query, where, orderBy, getDocs, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { 
    auth, 
    db, 
    storage, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    googleProvider,
    updateProfile,
    updatePassword,
    deleteUser,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    onSnapshot,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
};
