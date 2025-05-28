// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getStorage} from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqEKtcl6fomOiPE-ilAsKx1RYV5OQZRAA",
  authDomain: "instagram-clone-7bc1e.firebaseapp.com",
  projectId: "instagram-clone-7bc1e",
  storageBucket: "instagram-clone-7bc1e.appspot.com",
  messagingSenderId: "830164464888",
  appId: "1:830164464888:web:7398c20cd2a807d455770d",
  measurementId: "G-P8LDMR139E"
};

// Initialize Firebase
export  const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const storage=getStorage(app);
export const firestore=getFirestore(app);