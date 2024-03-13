import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
import 'firebase/compat/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAC-x4zVFuvTTFESMrajoBH6d8t-_pKksI",

  authDomain: "vizuaraschoolmanagement.firebaseapp.com",

  databaseURL: "https://vizuaraschoolmanagement-default-rtdb.firebaseio.com",

  projectId: "vizuaraschoolmanagement",

  storageBucket: "vizuaraschoolmanagement.appspot.com",

  messagingSenderId: "805912428641",

  appId: "1:805912428641:web:ef313e9240b99fd157ea20",
  measurementId: "G-PFCVJ6GRMG",

    databaseURL:'https://vizuaraschoolmanagement-default-rtdb.firebaseio.com'

};

firebase.initializeApp(firebaseConfig);
// Initialize Firebase

export const auth = firebase.default.auth();
// Get a reference to the database service
export const database = firebase.database();

// Get a reference to the storage service
export const storage = firebase.storage();