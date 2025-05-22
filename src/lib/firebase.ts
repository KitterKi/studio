
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEFXDkfklp3h_5nQArEBfUOL6v0P2xCps",
  authDomain: "stylemyroom-l25y8.firebaseapp.com",
  projectId: "stylemyroom-l25y8",
  storageBucket: "stylemyroom-l25y8.appspot.com", // Corrected from firebasestorage.app
  messagingSenderId: "99144798278",
  appId: "1:99144798278:web:663bbac40d4e2bbe273a47"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);

export { app, auth };
