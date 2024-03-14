// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

  apiKey: "AIzaSyCG-l7w3p6TQVkGaZycDLTI4-ph5STmW8E",

  authDomain: "vizuaradelta.firebaseapp.com",

  projectId: "vizuaradelta",

  storageBucket: "vizuaradelta.appspot.com",

  messagingSenderId: "1010171251555",

  appId: "1:1010171251555:web:25bd9cde3c2a99e3682156",

  measurementId: "G-12DXPJRTRV"

};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);