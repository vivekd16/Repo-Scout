import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAgxC4IQTyGnv-Br2vp__DWXpcYe_ktNCs",
    authDomain: "repo-scout.firebaseapp.com",
    projectId: "repo-scout",
    storageBucket: "repo-scout.firebasestorage.app",
    messagingSenderId: "611685050185",
    appId: "1:611685050185:web:348339373f6ca3afcb1c98",
    measurementId: "G-NE69G4GP2F"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 