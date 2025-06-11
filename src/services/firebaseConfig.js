// src/services/firebaseConfig.js
// IMPORTANT: Replace with your actual Firebase project configuration!
// This is placeholder configuration.

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
// import { getAnalytics } from "firebase/analytics"; // Optional: if you enabled Google Analytics

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API key
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // Replace with your actual auth domain
  projectId: "YOUR_PROJECT_ID", // Replace with your actual project ID
  storageBucket: "YOUR_PROJECT_ID.appspot.com", // Replace with your actual storage bucket
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID", // Replace with your actual messaging sender ID
  appId: "YOUR_APP_ID", // Replace with your actual app ID
  measurementId: "YOUR_MEASUREMENT_ID" // Optional: Replace if you have Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app); // Initialize Cloud Functions
// const analytics = getAnalytics(app); // Optional

// Log a message to confirm Firebase initialization (for development)
console.log("Firebase SDK initialized. Project ID:", firebaseConfig.projectId);
if (firebaseConfig.projectId === "YOUR_PROJECT_ID") {
    console.warn("Firebase configuration is using placeholder values. Replace them with your actual project config!");
    // Optionally, display a more prominent warning to the user/developer on the page itself
    // This helps ensure that the developer remembers to configure Firebase properly.

    // Wait for DOM to be loaded before trying to prepend to root or body
    document.addEventListener('DOMContentLoaded', () => {
        const rootEl = document.getElementById('root');
        const bodyEl = document.body;

        if ((rootEl || bodyEl) && !document.getElementById('firebaseConfigWarning')) {
            const warningDiv = document.createElement('div');
            warningDiv.id = 'firebaseConfigWarning';
            warningDiv.style.backgroundColor = 'red';
            warningDiv.style.color = 'white';
            warningDiv.style.padding = '10px';
            warningDiv.style.textAlign = 'center';
            warningDiv.style.position = 'fixed';
            warningDiv.style.top = '0';
            warningDiv.style.left = '0';
            warningDiv.style.width = '100%';
            warningDiv.style.zIndex = '9999';
            warningDiv.textContent = 'WARNING: Firebase is not configured. Please update src/services/firebaseConfig.js with your project details.';

            if (rootEl) {
                rootEl.prepend(warningDiv);
            } else {
                bodyEl.prepend(warningDiv);
            }
        }
    });
}

export { app, auth, db, functions };
