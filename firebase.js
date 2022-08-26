import { initializeApp } from "firebase/app";
import { auth } from "firebase/auth";
import firebase from "firebase/app";
const firebaseConfig = {
ur firebase configuration
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var Auth = auth;
export default Auth;
