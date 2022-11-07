import { initializeApp } from "firebase/app";
import { auth } from "firebase/auth";
import firebase from "firebase/app";
const firebaseConfig = { 
apiKey: "AIzaSyCoTB6jdhUlLxBhClN9An0v-bt_X_uzYSw",
authDomain: "otpauth-7f659.firebaseapp.com",
databaseURL: "https://otpauth-7f659-default-rtdb.firebaseio.com",
projectId: "otpauth-7f659",
storageBucket: "otpauth-7f659.appspot.com",
messagingSenderId: "862405200725",
appId: "1:862405200725:web:a16028e6960da54e2dfddc"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var Auth = auth;
export default Auth;
