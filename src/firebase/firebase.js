import firebase from "firebase"
import config from "./config.json";
import "firebase/firestore"
import "firebase/auth";
  
  // connect my app using my api key to firebase api
  let firebaseapp = firebase.initializeApp(config);
  
  // jiss website se hum user ko login krvana chahte hai e.g google se login , usse signup ki zrurat b nhi pdti
  // let provider = new firebase.auth.GoogleAuthProvider();
  
  // creating auth object
  export const auth  = firebaseapp.auth();
  export const fbStorage = firebaseapp.storage();
  export const fbDB = firebaseapp.firestore();
  // a function that specify how to login e.g sign in with popup show new windows to provider ie.e google
  // using auth object created above
  // export const signinWithGoogle = ()=>{
  //   auth.signInWithPopup(provider);
  // }

  // export const firestore = firebase.firestore();
