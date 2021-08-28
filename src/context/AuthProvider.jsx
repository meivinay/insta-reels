import React, { useEffect, useState } from "react";
import { auth, fbDB } from "../firebase/firebase";
// context created
export const AuthContext = React.createContext();

// a component , do some computation and than return a context.provider with props which will replace this componet in our App.js
export function AuthProvider({ children }) {
  const [users, setUser] = useState("null");

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password); // returns a promise
  }

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signout() {
    return auth.signOut();
  }

  useEffect(() => {
    // attach a listner on compdidmount for login and logout events
   let unsub = auth.onAuthStateChanged( (user) => {
      fbDB.collection("users").doc(user.uid).get().then((snapShot)=>{
      console.log("snapshot");
      console.log(snapShot.data());
      let userPhoto = snapShot.data().profilePictureUrl;
      let userObj ={...user, userPhoto:userPhoto}  
      setUser(userObj);
    })
  })
  }, []);

  let value = {
    currentUser: users,
    login: login,
    signup: signup,
    signout: signout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
