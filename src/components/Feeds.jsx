import { Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import {uuid} from "uuidv4";
import { fbDB, fbStorage } from "../firebase/firebase";

const Feeds = (props) => {
  const [video, setVideo] = useState(null);
  let { signout, currentUser } = useContext(AuthContext);
  let handleSignout = async () => {
    await signout();
    props.history.push("/login");
  };

  let handleInput = (e) => {
    let videofile = e.target.files[0];
    console.log(videofile);
    setVideo(videofile);
  };
  let handleUpload = async () => {
    try {
      // console.log("upload");
      let uid = currentUser.uid;
      // console.log(currentUser);
      // console.log(uid);
      let videoUploadPromise = fbStorage.ref(`/profilePhoto/${uid}/${Date.now()}.mp4`).put(video);
      videoUploadPromise.on("state_changed",progress, error, completion);
      function progress(){
        console.log("uploading");
      }
      function error(){
        console.log("error")
      }
      async function completion(){
        let videoUrl = await videoUploadPromise.snapshot.ref.getDownloadURL();
        console.log("upload completenpm ");
        let pid = uuid();
        await fbDB.collection("posts").doc(pid).set({
          pid:pid,
          uid:uid,
          comments:[],
          likes:[],
          videoLink:videoUrl
        })
        let document = await fbDB.collection("users").doc(uid).get();
        let userObj = document.data();
        userObj.postsCreated.push(pid);
        await fbDB.collection("users").doc(uid).set(userObj);
      }
    } catch(e) {
      console.log("error " +e);
    }
  };
  return (
    <>
      <h2>Feeds</h2>
      <button onClick={handleSignout}>Logout</button>
      <br></br>
      <input
      placeholder="upload"
        type="file"
        onChange={(e) => {
          handleInput(e);
        }}
      ></input>

      <br></br>
      <Button color="red" variant="contained" onClick={ handleUpload}>
        Upload
      </Button>
    </>
  );
};

export default Feeds;
