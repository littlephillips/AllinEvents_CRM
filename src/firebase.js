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
