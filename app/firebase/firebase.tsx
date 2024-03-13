// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAC-x4zVFuvTTFESMrajoBH6d8t-_pKksI",
  authDomain: "vizuaraschoolmanagement.firebaseapp.com",
  projectId: "vizuaraschoolmanagement",
  storageBucket: "vizuaraschoolmanagement.appspot.com",
  messagingSenderId: "805912428641",
  appId: "1:805912428641:web:ef313e9240b99fd157ea20",
  measurementId: "G-PFCVJ6GRMG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);