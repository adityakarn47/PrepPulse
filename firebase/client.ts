import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyABY0E_CQiic4-KQcqmouAqnC2wgD79mhs",
  authDomain: "college-project-dd614.firebaseapp.com",
  databaseURL: "https://college-project-dd614-default-rtdb.firebaseio.com",
  projectId: "college-project-dd614",
  storageBucket: "college-project-dd614.firebasestorage.app",
  messagingSenderId: "324117367640",
  appId: "1:324117367640:web:84fc83441e152767fa732d",
  measurementId: "G-SETSQCMB3S"
};


// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
