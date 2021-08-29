import { Avatar, Button, IconButton} from "@material-ui/core";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import {uuid} from "uuidv4";
import { fbDB, fbStorage } from "../firebase/firebase";
import PostCard from "../components/PostCard";
import Profile from "./Profile"
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import PublishIcon from '@material-ui/icons/Publish';
const Feeds = (props) => {
  const [video, setVideo] = useState(null);
  const [allPosts, setAllPosts] = useState([]);
  let { signout, currentUser,displayName,profilePicture , handleCurrentUser} = useContext(AuthContext);
  let handleSignout = async () => {
    await signout();
    props.history.push("/login");
  };
  let useStyles = makeStyles({
    border: {
      border: "1px solid black",
    },
    borderTop: {
      borderTop: "1px solid red",
    },
    height: {
      height: "3rem",
    },
    flexRow: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    containerPaddingNone: {
      padding: "0",
    },
    profile:{
      position:"absolute",
      top:"5rem",
      right:"3rem"
    },
    logOut:{
      position:"absolute",
      top:"8rem",
      right:"3rem"
    }
  });

  let classes = useStyles();
  let handleInput = (e) => {
    let videofile = e.target.files[0];
    setVideo(videofile);
  };
  let handleUpload = async () => {
    try {
      // console.log("upload");
      let uid = currentUser.uid;
      // console.log(currentUser);
      // console.log(uid);
      console.log(video);
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
        // console.log("upload completenpm ");
        let pid = uuid();
        await fbDB.collection("posts").doc(pid).set({
          pid:pid,
          uid:uid,
          comments:[],
          likes:[],
          videoURL:videoUrl
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
useEffect(()=>{
  let uid = currentUser.uid;

  fbDB.collection("users").doc(uid).get().then((snapShot)=>{
    let data = snapShot.data();
    let dpUrl = data.profilePictureUrl;
    let name = data.userName;
    handleCurrentUser( name, dpUrl)
  })
},[])
  useEffect(() => {
    let obj = {
      root: null,
      threshold: "0.9",
    };
    function callback(allVideo) {
      // console.log("allamsdkamsd");
      // console.log(allVideo);
      allVideo.forEach((video) => {
        let videoTag = video.target.children[0];
        videoTag.play().then(() => {
          if (video.isIntersecting === false) {
            videoTag.pause();
            // console.log("pause");
          }
        });
      });
    } 
    let observer = new IntersectionObserver(callback, obj);
    let element = document.querySelectorAll(".video-container");
    // console.log(element);
    element.forEach((el) => {
      observer.observe(el);
    });
  }, [allPosts]);
// get all posts
  useEffect(()=>{
       fbDB.collection("posts").get().then(snapshot=>{
         console.log("posts");
        // console.log(snapshot.docs[0].data())
        let allPosts = snapshot.docs.map(doc=>{
          return doc.data();
        })
        setAllPosts(allPosts);
       })
  },[])
  return (
    <>
        <IconButton onClick={handleSignout} className= {classes.logOut}>
         <ExitToAppIcon></ExitToAppIcon> 
        </IconButton>
        {/* <button onClick={handleSignout} className= {classes.logOut}>Logout</button> */}
        <input
        style = {{position:"fixed", top:"93vh",right:"7rem", zIndex:"10"}}
        placeholder="upload"
          type="file"
          onClick={(e) => {
          e.currentTarget.value = null;
        }}
          onChange={(e) => {
            handleInput(e);
          }}
        ></input>
        <Link to ="/profile"  className={classes.profile}>
        <Avatar src = {profilePicture}></Avatar>
          {/* <Button >Profile</Button> */}
        </Link>
        <IconButton  style = {{position:"absolute",color:"blue", bottom:"1rem", right:"3rem" ,zIndex:"10"}} onClick={ handleUpload}>
          <PublishIcon  fontSize="large" ></PublishIcon>
        </IconButton>
       
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",height:"100%"}}>
      {
        allPosts.map((post)=>{
          return <PostCard key={post.pid} post={post}></PostCard>
        })
      }
      </div>
    </>
  );
};  

export default Feeds;
