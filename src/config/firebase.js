// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGh5q9CF52WQVdll5Xpt_B8UIyGejwQxI",
  authDomain: "locator-c0cea.firebaseapp.com",
  projectId: "locator-c0cea",
  storageBucket: "locator-c0cea.appspot.com",
  messagingSenderId: "119563807317",
  appId: "1:119563807317:web:4921a70d0aa5d7e99f82dc",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
