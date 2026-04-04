import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Configuración de Firebase usando variables de ambiente
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDDvR37fgFMTPZBIs3OEqL5qk00A7ejXXs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mipaginaweb-14d2e.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mipaginaweb-14d2e",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mipaginaweb-14d2e.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "540722474978",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:540722474978:web:9825b39baffcf7bb02d3bb",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://mipaginaweb-14d2e.firebaseio.com"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Realtime Database
export const database = getDatabase(app);
