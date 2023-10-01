// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBITkcY3N7sGBt57c-bJ0PrRBfMZ-66qdc",
  authDomain: "react-mobile-otp.firebaseapp.com",
  projectId: "react-mobile-otp",
  storageBucket: "react-mobile-otp.appspot.com",
  messagingSenderId: "249618886496",
  appId: "1:249618886496:web:ba6e6a0e7340a7b74f3805",
  measurementId: "G-4V6QTS80EW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);