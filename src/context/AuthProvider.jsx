import React, { useEffect, useState } from "react";
import { auth, fbDB } from "../firebase/firebase";
// context created
export const AuthContext = React.createContext();

// a component , do some computation and than return a context.provider with props which will replace this componet in our App.js
export function AuthProvider({ children }) {
  const [users, setUser] = useState("null");
  const [displayName,setName] = useState("");
  const [profilePicture,setDP] = useState("");
  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password); // returns a promise
  }

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signout() {
    return auth.signOut();
  }
  function handleUser(displayName, userPhoto,users){
    setDP(userPhoto);
    setName(displayName);
    //   console.log(users);
  //  let handleInterval =  setInterval((users) => {
  //     console.log(users);  
  //   if(users){
  //       let userObj ={...users, userPhoto:userPhoto,displayName:displayName}  
  //       setUser(userObj);
  //       clearInterval(handleInterval)
  //       }
  //   }, 100);
  }
  useEffect(() => {
    // attach a listner on compdidmount for login and logout events
   auth.onAuthStateChanged( (user) => {
      setUser(user);
    })
  }
  , []);

  let value = {
    currentUser: users,
    login: login,
    signup: signup,
    signout: signout,
    displayName:displayName,
    profilePicture:profilePicture,
    handleCurrentUser:handleUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
