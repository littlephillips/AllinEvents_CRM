// ─────────────────────────────────────────────────────────────────────────────
// FIREBASE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
//
// SETUP STEPS:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (e.g. "allinevents-crm")
// 3. Click "Add App" → Web → register app
// 4. Copy your config values below
// 5. In Firebase Console:
//    - Enable Firestore Database (test mode to start)
//    - Enable Authentication → Email/Password
//    - Enable Hosting
// 6. Set Firestore Security Rules:
//
//    rules_version = '2';
//    service cloud.firestore {
//      match /databases/{database}/documents {
//        match /{document=**} {
//          allow read, write: if request.auth != null;
//        }
//      }
//    }
//
// 7. Create your first admin:
//    Firebase Console → Authentication → Users → Add User
//
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDo3BDMmbXJefdYXiACeTUX5qELKL3QPSs",
  authDomain: "allinevents-6be19.firebaseapp.com",
  projectId: "allinevents-6be19",
  storageBucket: "allinevents-6be19.firebasestorage.app",
  messagingSenderId: "532108483691",
  appId: "1:532108483691:web:5b774277c00ac8df55252e"
};


const app = initializeApp(firebaseConfig);

export const db   = getFirestore(app);
export const auth = getAuth(app);
export default app;
