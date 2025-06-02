// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDeQYMMBy3hGR-zSvzh5ikhHYu6I4np2mI",
  authDomain: "minutes360-997f6.firebaseapp.com",
  projectId: "minutes360-997f6",
  storageBucket: "minutes360-997f6.firebasestorage.app",
  messagingSenderId: "972006285863",
  appId: "1:972006285863:web:17701d71dc8249f698a402",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
